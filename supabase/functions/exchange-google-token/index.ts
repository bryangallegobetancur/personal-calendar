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
    const googleClientId = Deno.env.get('GOOGLE_CLIENT_ID')!
    const googleClientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')!
    const googleRedirectUri = Deno.env.get('GOOGLE_REDIRECT_URI')!

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
      client_id: googleClientId,
      client_secret: googleClientSecret,
      redirect_uri: googleRedirectUri,
      grant_type: 'authorization_code',
      code,
    }

    if (codeVerifier) {
      params.code_verifier = codeVerifier
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params),
    })

    if (!tokenResponse.ok) {
      const err = await tokenResponse.text()
      console.error('Google token exchange failed:', err)
      return new Response(JSON.stringify({ error: err }), { status: 400 })
    }

    const tokenData = await tokenResponse.json()

    const payload = {
      user_id: user.id,
      service: 'google',
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
      .eq('service', 'google')
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
