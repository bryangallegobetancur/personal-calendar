import { supabase } from './supabase'

export async function exchangeGoogleCode(code, codeVerifier) {
  const { data, error } = await supabase.functions.invoke('exchange-google-token', {
    body: { code, codeVerifier },
  })

  if (error) throw new Error(error.message || 'Google token exchange failed')
  if (data?.error) throw new Error(data.error)

  return data
}

export async function syncGoogleEvent(event, action) {
  const { data, error } = await supabase.functions.invoke('sync-calendar-event', {
    body: {
      service: 'google',
      action,
      event: {
        title: event.title,
        description: event.description || '',
        event_date: event.event_date,
        event_time: event.event_time,
        duration_minutes: event.duration_minutes || 60,
      },
      externalEventId: event.google_event_id || undefined,
    },
  })

  if (error) {
    console.error('Google Calendar sync error:', error)
    return null
  }
  if (data?.error) {
    console.error('Google Calendar sync error:', data.error)
    return null
  }

  return data?.externalEventId || null
}
