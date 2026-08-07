import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

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
    const microsoftClientId = Deno.env.get('MICROSOFT_CLIENT_ID')!
    const microsoftClientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET')!
    const microsoftRedirectUri = Deno.env.get('MICROSOFT_REDIRECT_URI')!
    const microsoftTenantId = Deno.env.get('MICROSOFT_TENANT_ID') || 'common'

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

    const { code, codeVerifier } = await req.json()

    if (!code) {
      return new Response(JSON.stringify({ error: 'Missing authorization code' }), { status: 400 })
    }

    const params: Record<string, string> = {
      client_id: microsoftClientId,
      client_secret: microsoftClientSecret,
      redirect_uri: microsoftRedirectUri,
      grant_type: 'authorization_code',
      code,
    }

    if (codeVerifier) {
      params.code_verifier = codeVerifier
    }

    const tokenUrl = `https://login.microsoftonline.com/${microsoftTenantId}/oauth2/v2.0/token`

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params),
    })

    if (!tokenResponse.ok) {
      const err = await tokenResponse.text()
      console.error('Microsoft token exchange failed:', err)
      return new Response(JSON.stringify({ error: err }), { status: 400 })
    }

    const tokenData = await tokenResponse.json()

    const payload = {
      user_id: user.id,
      service: 'outlook',
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      connected: true,
      connected_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: existing } = await supabase
      .from('integrations')
      .select('id')
      .eq('user_id', user.id)
      .eq('service', 'outlook')
      .maybeSingle()

    if (existing) {
      await supabase.from('integrations').update(payload).eq('id', existing.id)
    } else {
      await supabase.from('integrations').insert([payload])
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
