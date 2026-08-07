import { supabase } from './supabase'

export async function exchangeMicrosoftCode(code, codeVerifier) {
  const { data, error } = await supabase.functions.invoke('exchange-outlook-token', {
    body: { code, codeVerifier },
  })

  if (error) throw new Error(error.message || 'Microsoft token exchange failed')
  if (data?.error) throw new Error(data.error)

  return data
}

export async function syncOutlookEvent(event, action) {
  const { data, error } = await supabase.functions.invoke('sync-calendar-event', {
    body: {
      service: 'outlook',
      action,
      event: {
        title: event.title,
        description: event.description || '',
        event_date: event.event_date,
        event_time: event.event_time,
        duration_minutes: event.duration_minutes || 60,
      },
      externalEventId: event.outlook_event_id || undefined,
    },
  })

  if (error) {
    console.error('Outlook Calendar sync error:', error)
    return null
  }
  if (data?.error) {
    console.error('Outlook Calendar sync error:', data.error)
    return null
  }

  return data?.externalEventId || null
}
