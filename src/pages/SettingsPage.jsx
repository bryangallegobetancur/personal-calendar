import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { GoogleCalendarConnect } from '../components/integrations/GoogleCalendarConnect'
import { OutlookConnect } from '../components/integrations/OutlookConnect'
import { WhatsAppConnect } from '../components/integrations/WhatsAppConnect'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useIntegrations } from '../hooks/useIntegrations'
import { requestNotificationPermission } from '../lib/pushNotifications'

export function SettingsPage() {
  const { user, profile, updateProfile, fetchProfile } = useAuthStore()
  const { integrations, disconnectIntegration, saveIntegration } = useIntegrations()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [pushEnabled, setPushEnabled] = useState(false)

  useEffect(() => {
    if (profile) setName(profile.name || '')
  }, [profile])

  useEffect(() => {
    if ('Notification' in window) {
      setPushEnabled(Notification.permission === 'granted')
    }
  }, [])

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

  const handleTogglePush = async () => {
    if (pushEnabled) {
      setPushEnabled(false)
      return
    }
    const result = await requestNotificationPermission()
    if (result) setPushEnabled(true)
  }

  const handleGoogleConnect = async (tokenData) => {
    if (!user) return
    await saveIntegration('google', {
      ...tokenData,
      connected: true,
      connected_at: new Date().toISOString(),
    })
  }

  const handleOutlookConnect = async (tokenData) => {
    if (!user) return
    await saveIntegration('outlook', {
      ...tokenData,
      connected: true,
      connected_at: new Date().toISOString(),
    })
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
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      <section>
        <h2 className="text-lg font-semibold mb-4 text-foreground">Profile</h2>
        <div className="panel p-4 space-y-4 transition-colors">
          <Input
            label="Name"
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4 text-foreground">Notifications</h2>
        <div className="panel p-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Push Notifications</p>
              <p className="text-xs text-muted-foreground">Receive reminders in your browser</p>
            </div>
            <button
              onClick={handleTogglePush}
              className={`relative w-12 h-6 rounded-full transition-colors ${pushEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${pushEnabled ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Integrations</h2>
        <div className="space-y-3">
          <GoogleCalendarConnect
            connected={!!integrations.google?.connected}
            onConnect={handleGoogleConnect}
            onDisconnect={() => disconnectIntegration('google')}
          />
          <OutlookConnect
            connected={!!integrations.outlook?.connected}
            onConnect={handleOutlookConnect}
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
