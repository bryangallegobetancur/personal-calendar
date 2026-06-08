import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

interface Notification {
  id: string
  user_id: string
  event_id: string
  channel: 'whatsapp'
  status: 'pending'
  created_at: string
  events: {
    title: string
    event_date: string
    event_time: string
  }
  profiles: {
    phone: string
    name: string
  }
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID')!
  const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN')!
  const twilioWhatsAppNumber = Deno.env.get('TWILIO_WHATSAPP_NUMBER')!

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const now = new Date()
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select(`
        id,
        user_id,
        event_id,
        channel,
        status,
        created_at,
        events!inner(title, event_date, event_time),
        profiles!inner(phone, name)
      `)
      .eq('status', 'pending')
      .eq('channel', 'whatsapp')
      .not('profiles.phone', 'is', null)
      .limit(50)

    if (error) {
      console.error('Error fetching notifications:', error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    const results = []

    for (const notif of (notifications as unknown as Notification[])) {
      const eventDate = new Date(`${notif.events.event_date}T${notif.events.event_time}`)
      const diffMs = eventDate.getTime() - now.getTime()
      const diffMinutes = Math.floor(diffMs / 60000)

      if (diffMinutes > 0 && diffMinutes <= 15) {
        try {
          const message = `Hi ${notif.profiles.name}! Reminder: "${notif.events.title}" is scheduled for ${notif.events.event_date} at ${notif.events.event_time}.`

          const twilioResp = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                From: `whatsapp:${twilioWhatsAppNumber}`,
                To: `whatsapp:${notif.profiles.phone}`,
                Body: message,
              }),
            }
          )

          if (twilioResp.ok) {
            await supabase
              .from('notifications')
              .update({ status: 'sent', sent_at: new Date().toISOString() })
              .eq('id', notif.id)

            results.push({ id: notif.id, status: 'sent' })
          } else {
            const errBody = await twilioResp.text()
            await supabase
              .from('notifications')
              .update({ status: 'failed', error_message: errBody })
              .eq('id', notif.id)

            results.push({ id: notif.id, status: 'failed', error: errBody })
          }
        } catch (err) {
          console.error(`Error sending WhatsApp for ${notif.id}:`, err)
          await supabase
            .from('notifications')
            .update({ status: 'failed', error_message: String(err) })
            .eq('id', notif.id)

          results.push({ id: notif.id, status: 'failed', error: String(err) })
        }
      }
    }

    return new Response(JSON.stringify({ processed: results }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
