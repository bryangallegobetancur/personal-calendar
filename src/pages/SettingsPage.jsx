import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { GoogleCalendarConnect } from '../components/integrations/GoogleCalendarConnect'
import { OutlookConnect } from '../components/integrations/OutlookConnect'
import { WhatsAppConnect } from '../components/integrations/WhatsAppConnect'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useIntegrations } from '../hooks/useIntegrations'

export function SettingsPage() {
  const { user, profile, updateProfile, fetchProfile } = useAuthStore()
  const { integrations, disconnectIntegration, saveIntegration } = useIntegrations()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) setName(profile.name || '')
  }, [profile])

  const handleSaveProfile = async () => {
    if (!user) return
    setSaving(true)
    try {
      await updateProfile(user.id, { name })
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleWhatsAppConnect = async (phone) => {
    if (!user) return
    await updateProfile(user.id, { phone, whatsapp_consent: true })
    await saveIntegration('whatsapp', {
      connected: true,
      connected_at: new Date().toISOString(),
    })
  }

  const handleWhatsAppDisconnect = async () => {
    if (!user) return
    await updateProfile(user.id, { whatsapp_consent: false })
    await disconnectIntegration('whatsapp')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>

      <section>
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Profile</h2>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 space-y-4 transition-colors">
          <Input
            label="Name"
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">Email: {user?.email}</p>
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Integrations</h2>
        <div className="space-y-3">
          <GoogleCalendarConnect
            connected={!!integrations.google?.connected}
            onDisconnect={() => disconnectIntegration('google')}
          />
          <OutlookConnect
            connected={!!integrations.outlook?.connected}
            onDisconnect={() => disconnectIntegration('outlook')}
          />
          <WhatsAppConnect
            connected={!!integrations.whatsapp?.connected}
            onConnect={handleWhatsAppConnect}
            onDisconnect={handleWhatsAppDisconnect}
          />
        </div>
      </section>
    </div>
  )
}
