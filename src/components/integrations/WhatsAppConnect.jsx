import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Checkbox } from '../ui/Checkbox'
import { WhatsAppIcon } from '../ui/Icons'

export function WhatsAppConnect({ connected, onConnect, onDisconnect }) {
  const [showModal, setShowModal] = useState(false)
  const [phone, setPhone] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConnect = async () => {
    if (!accepted || !phone) return
    setLoading(true)
    try {
      await onConnect(phone)
      setShowModal(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (connected) {
    return (
      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 transition-colors">
        <div className="flex items-center gap-3">
          <WhatsAppIcon className="w-8 h-8" />
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">WhatsApp Reminders</p>
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
          <WhatsAppIcon className="w-8 h-8" />
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">WhatsApp Reminders</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Not connected</p>
          </div>
        </div>
        <Button onClick={() => setShowModal(true)}>Connect</Button>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Connect WhatsApp">
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-medium mb-1">Permissions requested:</p>
            <ul className="list-disc list-inside">
              <li>Send reminder messages to your WhatsApp number</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">How we will use this:</p>
            <p>We use WhatsApp to send you timely reminders about your upcoming appointments. We will never share your number or send spam.</p>
          </div>

          <Input
            label="WhatsApp phone number (with country code)"
            id="whatsapp-phone"
            type="tel"
            placeholder="+521234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Checkbox
            id="whatsapp-consent"
            label="I agree to receive appointment reminders via WhatsApp. I understand I can revoke this consent at any time."
            checked={accepted}
            onChange={setAccepted}
          />

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConnect} disabled={!accepted || !phone || loading}>
              {loading ? 'Connecting...' : 'Accept & Connect'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
