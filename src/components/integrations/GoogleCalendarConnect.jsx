import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Checkbox } from '../ui/Checkbox'
import { ConsentModal } from './ConsentModal'
import { GoogleIcon } from '../ui/Icons'

export function GoogleCalendarConnect({ connected, onConnect, onDisconnect }) {
  const [showConsent, setShowConsent] = useState(false)
  const [accepted, setAccepted] = useState(false)

  const handleConnect = () => {
    if (!accepted) return
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/calendar',
      access_type: 'offline',
      prompt: 'consent',
    })

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  }

  if (connected) {
    return (
      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 transition-colors">
        <div className="flex items-center gap-3">
          <GoogleIcon className="w-8 h-8" />
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">Google Calendar</p>
            <p className="text-sm text-green-600 dark:text-green-400">Connected</p>
          </div>
        </div>
        <Button variant="danger" onClick={onDisconnect}>
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 transition-colors">
        <div className="flex items-center gap-3">
          <GoogleIcon className="w-8 h-8" />
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">Google Calendar</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Not connected</p>
          </div>
        </div>
        <Button onClick={() => setShowConsent(true)}>Connect</Button>
      </div>

      <Modal open={showConsent} onClose={() => setShowConsent(false)} title="Connect Google Calendar">
        <ConsentModal
          service="google"
          onConfirm={handleConnect}
          onCancel={() => setShowConsent(false)}
        />
      </Modal>
    </>
  )
}
