import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { syncGoogleEvent } from '../lib/googleCalendar'
import { syncOutlookEvent } from '../lib/outlookCalendar'

export function useEvents() {
  const user = useAuthStore((s) => s.user)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

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

  const handleWhatsAppNotification = async (event, action) => {
    if (action === 'delete' || action === 'update') {
      await supabase
        .from('notifications')
        .delete()
        .eq('event_id', event.id)
        .eq('channel', 'whatsapp')
    }

    if (event.whatsapp_reminder && action !== 'delete') {
      await supabase
        .from('notifications')
        .insert([{
          user_id: user.id,
          event_id: event.id,
          channel: 'whatsapp',
          status: 'pending',
        }])
    }
  }

  const createEvent = async (event) => {
    const payload = { ...event, user_id: user.id }
    const { data, error } = await supabase
      .from('events')
      .insert([payload])
      .select()
      .single()
    if (error) throw error

    setEvents((prev) => [...prev, data])

    syncExternalCalendars(data, 'create')
    handleWhatsAppNotification(data, 'create')

    return data
  }

  const updateEvent = async (id, updates) => {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error

    setEvents((prev) => prev.map((e) => (e.id === id ? data : e)))

    syncExternalCalendars(data, 'update')
    handleWhatsAppNotification(data, 'update')

    return data
  }

  const deleteEvent = async (id) => {
    const eventToDelete = events.find((e) => e.id === id)

    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) throw error

    setEvents((prev) => prev.filter((e) => e.id !== id))

    if (eventToDelete) {
      syncExternalCalendars(eventToDelete, 'delete')
      handleWhatsAppNotification(eventToDelete, 'delete')
    }
  }

  return { events, loading, fetchEvents, createEvent, updateEvent, deleteEvent }
}
