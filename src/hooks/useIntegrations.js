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

  const saveIntegration = async (service, integrationData) => {
    const payload = {
      user_id: user.id,
      service,
      access_token: integrationData.access_token || null,
      refresh_token: integrationData.refresh_token || null,
      token_expires_at: integrationData.token_expires_at || null,
      connected: integrationData.connected ?? true,
      connected_at: integrationData.connected_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const existing = integrations[service]

    if (existing) {
      const { data, error } = await supabase
        .from('integrations')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single()
      if (error) throw error
      setIntegrations((prev) => ({ ...prev, [service]: data }))
      return data
    } else {
      const { data, error } = await supabase
        .from('integrations')
        .insert([payload])
        .select()
        .single()
      if (error) throw error
      setIntegrations((prev) => ({ ...prev, [service]: data }))
      return data
    }
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
