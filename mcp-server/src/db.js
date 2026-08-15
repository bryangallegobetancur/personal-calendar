import { supabase } from './supabase.js'

const ownerUserId = process.env.MCP_USER_ID
if (!ownerUserId) {
  throw new Error('Missing MCP_USER_ID environment variable (the Supabase user UUID whose calendar is exposed)')
}

export async function listEvents({ startDate, endDate, status, category }) {
  let query = supabase
    .from('events')
    .select('*')
    .eq('user_id', ownerUserId)
    .order('event_date', { ascending: true })
    .order('event_time', { ascending: true })

  if (startDate) query = query.gte('event_date', startDate)
  if (endDate) query = query.lte('event_date', endDate)
  if (status) query = query.eq('status', status)
  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) throw new Error(`Supabase error: ${error.message}`)
  return data || []
}

export async function getEvent(id) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('user_id', ownerUserId)
    .single()
  if (error) {
    if (error.code === 'PGRST116') throw new Error('Event not found')
    throw new Error(`Supabase error: ${error.message}`)
  }
  return data
}

export async function searchEvents(queryText) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', ownerUserId)
    .or(`title.ilike.%${queryText}%,description.ilike.%${queryText}%,category.ilike.%${queryText}%`)
    .order('event_date', { ascending: true })
  if (error) throw new Error(`Supabase error: ${error.message}`)
  return data || []
}

export async function createEvent(payload) {
  const { data, error } = await supabase
    .from('events')
    .insert([{ ...payload, user_id: ownerUserId }])
    .select()
    .single()
  if (error) throw new Error(`Supabase error: ${error.message}`)
  return data
}

export async function updateEvent(id, updates) {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .eq('user_id', ownerUserId)
    .select()
    .single()
  if (error) {
    if (error.code === 'PGRST116') throw new Error('Event not found')
    throw new Error(`Supabase error: ${error.message}`)
  }
  return data
}

export async function deleteEvent(id) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
    .eq('user_id', ownerUserId)
  if (error) throw new Error(`Supabase error: ${error.message}`)
  return { ok: true, id }
}

export async function checkConflict({ eventDate, eventTime, durationMinutes, excludeId }) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', ownerUserId)
    .eq('event_date', eventDate)
    .neq('status', 'cancelled')
  if (error) throw new Error(`Supabase error: ${error.message}`)

  const newStart = new Date(`${eventDate}T${eventTime}`)
  const newEnd = new Date(newStart.getTime() + (durationMinutes || 60) * 60000)

  const conflicts = (data || []).filter((e) => {
    if (excludeId && e.id === excludeId) return false
    if (!e.event_time) return false
    const eStart = new Date(`${e.event_date}T${e.event_time}`)
    const eEnd = new Date(eStart.getTime() + (e.duration_minutes || 60) * 60000)
    return newStart < eEnd && newEnd > eStart
  })

  return conflicts
}

export async function listNotifications({ eventId, status, channel }) {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', ownerUserId)
    .order('created_at', { ascending: false })

  if (eventId) query = query.eq('event_id', eventId)
  if (status) query = query.eq('status', status)
  if (channel) query = query.eq('channel', channel)

  const { data, error } = await query
  if (error) throw new Error(`Supabase error: ${error.message}`)
  return data || []
}

export async function listIntegrations() {
  const { data, error } = await supabase
    .from('integrations')
    .select('service, connected, connected_at, token_expires_at')
    .eq('user_id', ownerUserId)
  if (error) throw new Error(`Supabase error: ${error.message}`)
  return data || []
}
