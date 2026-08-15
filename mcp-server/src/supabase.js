import { createClient } from '@supabase/supabase-js'

let client = null

export function getSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  }

  if (!client) {
    client = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    })
  }
  return client
}
