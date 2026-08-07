import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

interface Notification {
  id: string
  user_id: string
  event_id: string
  channel: 'whatsapp' | 'email'
  status: 'pending'
  created_at: string
  events: {
    title: string
    event_date: string
    event_time: string
    reminder_before_minutes: number | null
  }
  profiles: {
    phone: string | null
    email: string | null
    name: string
  }
}

async function sendWhatsApp(notif: Notification, supabase: ReturnType<typeof createClient>) {
  const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID')!
  const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN')!
  const twilioWhatsAppNumber = Deno.env.get('TWILIO_WHATSAPP_NUMBER')!

  if (!notif.profiles.phone) {
    await supabase.from('notifications').update({ status: 'failed', error_message: 'No phone number' }).eq('id', notif.id)
    return { id: notif.id, status: 'failed', error: 'No phone number' }
  }

  const message = `Hi ${notif.profiles.name}! Reminder: "${notif.events.title}" is scheduled for ${notif.events.event_date} at ${notif.events.event_time?.slice(0, 5)}.`

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
    await supabase.from('notifications').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', notif.id)
    return { id: notif.id, status: 'sent' }
  } else {
    const errBody = await twilioResp.text()
    await supabase.from('notifications').update({ status: 'failed', error_message: errBody }).eq('id', notif.id)
    return { id: notif.id, status: 'failed', error: errBody }
  }
}

async function sendEmail(notif: Notification, supabase: ReturnType<typeof createClient>) {
  const emailFrom = Deno.env.get('EMAIL_FROM')
  const resendApiKey = Deno.env.get('RESEND_API_KEY')

  if (!notif.profiles.email) {
    await supabase.from('notifications').update({ status: 'failed', error_message: 'No email' }).eq('id', notif.id)
    return { id: notif.id, status: 'failed', error: 'No email' }
  }

  if (resendApiKey && emailFrom) {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailFrom,
        to: notif.profiles.email,
        subject: `Reminder: ${notif.events.title}`,
        html: `<p>Hi ${notif.profiles.name},</p><p>This is a reminder for your event:</p><h3>${notif.events.title}</h3><p>Date: ${notif.events.event_date}<br>Time: ${notif.events.event_time?.slice(0, 5)}</p>`,
      }),
    })

    if (resp.ok) {
      await supabase.from('notifications').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', notif.id)
      return { id: notif.id, status: 'sent' }
    } else {
      const err = await resp.text()
      await supabase.from('notifications').update({ status: 'failed', error_message: err }).eq('id', notif.id)
      return { id: notif.id, status: 'failed', error: err }
    }
  }

  if (emailFrom) {
    const { error } = await supabase.rpc('send_email_notification', {
      p_to: notif.profiles.email,
      p_subject: `Reminder: ${notif.events.title}`,
      p_body: `Hi ${notif.profiles.name}, reminder: "${notif.events.title}" is scheduled for ${notif.events.event_date} at ${notif.events.event_time?.slice(0, 5)}.`,
    })
    if (!error) {
      await supabase.from('notifications').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', notif.id)
      return { id: notif.id, status: 'sent' }
    }
  }

  await supabase.from('notifications').update({ status: 'failed', error_message: 'No email provider configured' }).eq('id', notif.id)
  return { id: notif.id, status: 'failed', error: 'No email provider configured' }
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const now = new Date()

    const { data: whatsappNotifs, error: wErr } = await supabase
      .from('notifications')
      .select(`
        id, user_id, event_id, channel, status, created_at,
        events!inner(title, event_date, event_time, reminder_before_minutes),
        profiles!inner(phone, email, name)
      `)
      .eq('status', 'pending')
      .eq('channel', 'whatsapp')
      .not('profiles.phone', 'is', null)
      .limit(50)

    const { data: emailNotifs, error: eErr } = await supabase
      .from('notifications')
      .select(`
        id, user_id, event_id, channel, status, created_at,
        events!inner(title, event_date, event_time, reminder_before_minutes),
        profiles!inner(phone, email, name)
      `)
      .eq('status', 'pending')
      .eq('channel', 'email')
      .not('profiles.email', 'is', null)
      .limit(50)

    if (wErr) console.error('Error fetching WhatsApp notifications:', wErr)
    if (eErr) console.error('Error fetching email notifications:', eErr)

    const allNotifications = [
      ...((whatsappNotifs as unknown as Notification[]) || []),
      ...((emailNotifs as unknown as Notification[]) || []),
    ]

    const results = []

    for (const notif of allNotifications) {
      const eventDate = new Date(`${notif.events.event_date}T${notif.events.event_time || '00:00:00'}`)
      const diffMs = eventDate.getTime() - now.getTime()
      const diffMinutes = Math.floor(diffMs / 60000)
      const reminderMinutes = notif.events.reminder_before_minutes || 15

      if (diffMinutes > 0 && diffMinutes <= reminderMinutes) {
        try {
          if (notif.channel === 'whatsapp') {
            const result = await sendWhatsApp(notif, supabase)
            results.push(result)
          } else if (notif.channel === 'email') {
            const result = await sendEmail(notif, supabase)
            results.push(result)
          }
        } catch (err) {
          console.error(`Error processing ${notif.id}:`, err)
          await supabase.from('notifications').update({ status: 'failed', error_message: String(err) }).eq('id', notif.id)
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
