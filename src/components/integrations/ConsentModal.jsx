import { Button } from '../ui/Button'
import { GoogleIcon, OutlookIcon, WhatsAppIcon } from '../ui/Icons'

export function ConsentModal({ service, onConfirm, onCancel }) {
  const serviceInfo = {
    google: {
      name: 'Google Calendar',
      icon: <GoogleIcon className="w-9 h-9" />,
      permissions: ['View your calendar events', 'Create and edit events on your behalf', 'Read your calendar settings'],
      usage: 'We use this to sync your appointments so they appear in your Google Calendar automatically.',
    },
    outlook: {
      name: 'Microsoft Outlook Calendar',
      icon: <OutlookIcon className="w-9 h-9" />,
      permissions: ['View your calendar events', 'Create and edit events on your behalf', 'Read your calendar settings'],
      usage: 'We use this to sync your appointments so they appear in your Outlook Calendar automatically.',
    },
    whatsapp: {
      name: 'WhatsApp',
      icon: <WhatsAppIcon className="w-9 h-9" />,
      permissions: ['Send reminder messages to your WhatsApp number'],
      usage: 'We use this to send you timely reminders about your upcoming appointments via WhatsApp.',
    },
  }

  const info = serviceInfo[service]

  if (!info) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex-shrink-0">{info.icon}</span>
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Connect {info.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Authorize access to your account</p>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 text-sm text-yellow-800 dark:text-yellow-200">
        <p className="font-medium mb-1">Permissions requested:</p>
        <ul className="list-disc list-inside space-y-0.5">
          {info.permissions.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200">
        <p className="font-medium mb-1">How we will use this:</p>
        <p>{info.usage}</p>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>
          Accept & Connect
        </Button>
      </div>
    </div>
  )
}
