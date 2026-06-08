import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

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

  const createEvent = async (event) => {
    const { data, error } = await supabase
      .from('events')
      .insert([{ ...event, user_id: user.id }])
      .select()
      .single()
    if (error) throw error
    setEvents((prev) => [...prev, data])
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
    return data
  }

  const deleteEvent = async (id) => {
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) throw error
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  return { events, loading, fetchEvents, createEvent, updateEvent, deleteEvent }
}
