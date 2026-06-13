import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { ConsentModal } from './ConsentModal'
import { OutlookIcon } from '../ui/Icons'

export function OutlookConnect({ connected, onConnect, onDisconnect }) {
  const [showConsent, setShowConsent] = useState(false)

  const handleConnect = () => {
    const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID
    const redirectUri = import.meta.env.VITE_MICROSOFT_REDIRECT_URI
    const tenantId = import.meta.env.VITE_MICROSOFT_TENANT_ID || 'common'

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'Calendars.ReadWrite offline_access',
      response_mode: 'query',
    })

    window.location.href = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${params}`
  }

  if (connected) {
    return (
      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 transition-colors">
        <div className="flex items-center gap-3">
          <OutlookIcon className="w-8 h-8" />
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">Outlook Calendar</p>
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
          <OutlookIcon className="w-8 h-8" />
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">Outlook Calendar</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Not connected</p>
          </div>
        </div>
        <Button onClick={() => setShowConsent(true)}>Connect</Button>
      </div>

      <Modal open={showConsent} onClose={() => setShowConsent(false)} title="Connect Outlook Calendar">
        <ConsentModal
          service="outlook"
          onConfirm={handleConnect}
          onCancel={() => setShowConsent(false)}
        />
      </Modal>
    </>
  )
}
