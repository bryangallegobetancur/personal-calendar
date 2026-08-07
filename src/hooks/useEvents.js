import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { syncGoogleEvent } from '../lib/googleCalendar'
import { syncOutlookEvent } from '../lib/outlookCalendar'

export function useEvents() {
  const user = useAuthStore((s) => s.user)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchEvents = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .order('event_date', { ascending: true })
      .order('event_time', { ascending: true })
    if (!error) setEvents(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const searchEvents = useCallback(
    (query) => {
      setSearchQuery(query)
      if (!query.trim()) return events
      const q = query.toLowerCase()
      return events.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.category?.toLowerCase().includes(q)
      )
    },
    [events]
  )

  const checkConflict = async (eventDate, eventTime, durationMinutes, excludeId) => {
    if (!user) return null
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .eq('event_date', eventDate)
      .neq('status', 'cancelled')
    if (!data) return null

    const newStart = new Date(`${eventDate}T${eventTime}`)
    const newEnd = new Date(newStart.getTime() + (durationMinutes || 60) * 60000)

    const conflicts = data.filter((e) => {
      if (excludeId && e.id === excludeId) return false
      if (!e.event_time) return false
      const eStart = new Date(`${e.event_date}T${e.event_time}`)
      const eEnd = new Date(eStart.getTime() + (e.duration_minutes || 60) * 60000)
      return newStart < eEnd && newEnd > eStart
    })

    return conflicts.length > 0 ? conflicts : null
  }

  const generateRecurringInstances = async (event, rule) => {
    if (!rule) return

    const { data, error } = await supabase.rpc('generate_recurring_instances', {
      p_start_date: event.event_date,
      p_rule: rule,
      p_end_date: event.recurrence_end_date || null,
    })

    if (error || !data) return

    const instances = data.map((r) => ({
      ...event,
      id: undefined,
      parent_event_id: event.id,
      event_date: r.instance_date,
      sync_google: false,
      sync_outlook: false,
      whatsapp_reminder: false,
      recurrence_rule: null,
      recurrence_end_date: null,
    }))

    const { error: insertError } = await supabase.from('events').insert(instances)
    if (!insertError) await fetchEvents()
  }

  const syncExternalCalendars = async (event, action) => {
    if (event.sync_google) {
      const googleId = await syncGoogleEvent(event, action)
      if (googleId && action !== 'delete') {
        await supabase
          .from('events')
          .update({ google_event_id: googleId })
          .eq('id', event.id)
      }
    }
    if (event.sync_outlook) {
      const outlookId = await syncOutlookEvent(event, action)
      if (outlookId && action !== 'delete') {
        await supabase
          .from('events')
          .update({ outlook_event_id: outlookId })
          .eq('id', event.id)
      }
    }
  }

  const handleNotifications = async (event, action) => {
    if (action === 'delete' || action === 'update') {
      await supabase
        .from('notifications')
        .delete()
        .eq('event_id', event.id)
    }

    if (action === 'delete') return

    if (event.whatsapp_reminder) {
      await supabase.from('notifications').insert([{
        user_id: user.id,
        event_id: event.id,
        channel: 'whatsapp',
        status: 'pending',
      }])
    }

    if (event.email_reminder) {
      await supabase.from('notifications').insert([{
        user_id: user.id,
        event_id: event.id,
        channel: 'email',
        status: 'pending',
      }])
    }
  }

  const createEvent = async (event) => {
    const payload = { ...event, user_id: user.id }

    if (payload.event_time) {
      const conflicts = await checkConflict(
        payload.event_date,
        payload.event_time,
        payload.duration_minutes || 60,
        null
      )
      if (conflicts) return { conflict: true, conflicts }
    }

    const { data, error } = await supabase
      .from('events')
      .insert([payload])
      .select()
      .single()
    if (error) throw error

    setEvents((prev) => [...prev, data])

    syncExternalCalendars(data, 'create')
    handleNotifications(data, 'create')

    if (data.recurrence_rule) {
      await generateRecurringInstances(data, data.recurrence_rule)
    }

    return { conflict: false, data }
  }

  const updateEvent = async (id, updates) => {
    if (updates.event_time) {
      const conflicts = await checkConflict(
        updates.event_date,
        updates.event_time,
        updates.duration_minutes || 60,
        id
      )
      if (conflicts) return { conflict: true, conflicts }
    }

    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error

    setEvents((prev) => prev.map((e) => (e.id === id ? data : e)))

    syncExternalCalendars(data, 'update')
    handleNotifications(data, 'update')

    return { conflict: false, data }
  }

  const deleteEvent = async (id) => {
    const eventToDelete = events.find((e) => e.id === id)

    if (eventToDelete?.parent_event_id) {
      await supabase.from('events').delete().eq('id', id)
    } else {
      await supabase.from('events').delete().eq('parent_event_id', id)
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw error
    }

    setEvents((prev) => prev.filter((e) => e.id !== id && e.parent_event_id !== id))

    if (eventToDelete) {
      syncExternalCalendars(eventToDelete, 'delete')
      handleNotifications(eventToDelete, 'delete')
    }
  }

  const bulkImportEvents = async (importedEvents) => {
    const payloads = importedEvents.map((ev) => ({
      ...ev,
      user_id: user.id,
      status: ev.status || 'pending',
      duration_minutes: ev.duration_minutes || 60,
      event_time: ev.event_time || '00:00:00',
    }))

    const { error } = await supabase.from('events').insert(payloads)
    if (error) throw error
    await fetchEvents()
  }

  const exportAllEvents = () => events

  return {
    events,
    loading,
    searchQuery,
    searchEvents,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    checkConflict,
    bulkImportEvents,
    exportAllEvents,
  }
}
