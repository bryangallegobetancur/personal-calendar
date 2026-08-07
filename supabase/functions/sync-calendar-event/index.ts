import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

interface EventInput {
  title: string
  description: string
  event_date: string
  event_time: string
  duration_minutes: number
}

function buildDateTime(event: EventInput) {
  const start = new Date(`${event.event_date}T${event.event_time}Z`)
  const duration = event.duration_minutes || 60
  const end = new Date(start.getTime() + duration * 60000)
  return {
    startDateTime: start.toISOString(),
    endDateTime: end.toISOString(),
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const { service, action, event, externalEventId } = await req.json()

    if (!service || !action || !event) {
      return new Response(JSON.stringify({ error: 'service, action, and event are required' }), { status: 400 })
    }

    const { data: integration, error: intError } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', user.id)
      .eq('service', service)
      .eq('connected', true)
      .maybeSingle()

    if (intError || !integration) {
      return new Response(JSON.stringify({ error: `No connected ${service} integration found` }), { status: 404 })
    }

    let accessToken = integration.access_token

    const expiresAt = integration.token_expires_at ? new Date(integration.token_expires_at) : null
    if (expiresAt && expiresAt <= new Date(Date.now() + 60000) && integration.refresh_token) {
      const refreshed = await refreshToken(service, integration.refresh_token)
      if (refreshed) {
        accessToken = refreshed.access_token
        await supabase
          .from('integrations')
          .update({
            access_token: refreshed.access_token,
            token_expires_at: refreshed.token_expires_at,
            ...(refreshed.refresh_token ? { refresh_token: refreshed.refresh_token } : {}),
            updated_at: new Date().toISOString(),
          })
          .eq('id', integration.id)
      }
    }

    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'No valid access token' }), { status: 401 })
    }

    let result: Record<string, unknown> = {}

    if (service === 'google') {
      result = await handleGoogleCalendar(accessToken, action as string, event as EventInput, externalEventId as string)
    } else if (service === 'outlook') {
      result = await handleOutlookCalendar(accessToken, action as string, event as EventInput, externalEventId as string)
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported service' }), { status: 400 })
    }

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})

async function refreshToken(service: string, refreshToken: string) {
  try {
    if (service === 'google') {
      const clientId = Deno.env.get('GOOGLE_CLIENT_ID')!
      const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')!

      const resp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      })

      if (!resp.ok) return null
      const data = await resp.json()
      return {
        access_token: data.access_token,
        token_expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
      }
    }

    if (service === 'outlook') {
      const clientId = Deno.env.get('MICROSOFT_CLIENT_ID')!
      const clientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET')!
      const tenantId = Deno.env.get('MICROSOFT_TENANT_ID') || 'common'

      const resp = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      })

      if (!resp.ok) return null
      const data = await resp.json()
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        token_expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
      }
    }

    return null
  } catch {
    return null
  }
}

async function handleGoogleCalendar(
  accessToken: string,
  action: string,
  event: EventInput,
  externalEventId: string
): Promise<Record<string, unknown>> {
  const API = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'
  const { startDateTime, endDateTime } = buildDateTime(event)

  const body = {
    summary: event.title,
    description: event.description || '',
    start: { dateTime: startDateTime, timeZone: 'UTC' },
    end: { dateTime: endDateTime, timeZone: 'UTC' },
  }

  if (action === 'create') {
    const resp = await fetch(API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!resp.ok) {
      const err = await resp.text()
      throw new Error(`Google create failed: ${err}`)
    }
    const data = await resp.json()
    return { externalEventId: data.id }
  }

  if (action === 'update' && externalEventId) {
    const resp = await fetch(`${API}/${externalEventId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!resp.ok) {
      const err = await resp.text()
      throw new Error(`Google update failed: ${err}`)
    }
    return { success: true }
  }

  if (action === 'delete' && externalEventId) {
    const resp = await fetch(`${API}/${externalEventId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    if (!resp.ok) {
      const err = await resp.text()
      throw new Error(`Google delete failed: ${err}`)
    }
    return { success: true }
  }

  return { error: 'Invalid action or missing externalEventId' }
}

async function handleOutlookCalendar(
  accessToken: string,
  action: string,
  event: EventInput,
  externalEventId: string
): Promise<Record<string, unknown>> {
  const API = 'https://graph.microsoft.com/v1.0/me/events'
  const { startDateTime, endDateTime } = buildDateTime(event)

  const body = {
    subject: event.title,
    body: { contentType: 'text', content: event.description || '' },
    start: { dateTime: startDateTime, timeZone: 'UTC' },
    end: { dateTime: endDateTime, timeZone: 'UTC' },
  }

  if (action === 'create') {
    const resp = await fetch(API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!resp.ok) {
      const err = await resp.text()
      throw new Error(`Outlook create failed: ${err}`)
    }
    const data = await resp.json()
    return { externalEventId: data.id }
  }

  if (action === 'update' && externalEventId) {
    const resp = await fetch(`${API}/${externalEventId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!resp.ok) {
      const err = await resp.text()
      throw new Error(`Outlook update failed: ${err}`)
    }
    return { success: true }
  }

  if (action === 'delete' && externalEventId) {
    const resp = await fetch(`${API}/${externalEventId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    if (!resp.ok) {
      const err = await resp.text()
      throw new Error(`Outlook delete failed: ${err}`)
    }
    return { success: true }
  }

  return { error: 'Invalid action or missing externalEventId' }
}
