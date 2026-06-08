import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

export function useIntegrations() {
  const user = useAuthStore((s) => s.user)
  const [integrations, setIntegrations] = useState({ google: null, outlook: null, whatsapp: null })
  const [loading, setLoading] = useState(true)

  const fetchIntegrations = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', user.id)

    if (!error && data) {
      const map = { google: null, outlook: null, whatsapp: null }
      data.forEach((i) => {
        map[i.service] = i
      })
      setIntegrations(map)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchIntegrations()
  }, [fetchIntegrations])

  const saveIntegration = async (service, data) => {
    const payload = {
      user_id: user.id,
      service,
      ...data,
    }

    const existing = integrations[service]

    if (existing) {
      const { error } = await supabase
        .from('integrations')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('integrations').insert([payload])
      if (error) throw error
    }

    await fetchIntegrations()
  }

  const disconnectIntegration = async (service) => {
    const existing = integrations[service]
    if (!existing) return

    const { error } = await supabase
      .from('integrations')
      .delete()
      .eq('id', existing.id)
    if (error) throw error

    setIntegrations((prev) => ({ ...prev, [service]: null }))
  }

  return { integrations, loading, fetchIntegrations, saveIntegration, disconnectIntegration }
}
