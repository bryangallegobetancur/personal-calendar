import { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Checkbox } from '../ui/Checkbox'

const REMINDER_OPTIONS = [
  { value: 15, label: '15 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 1440, label: '1 day before' },
]

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

export function EventForm({ event, onSubmit, onCancel, integrations }) {
  const [form, setForm] = useState({
    title: event?.title || '',
    description: event?.description || '',
    event_date: event?.event_date || '',
    event_time: event?.event_time || '',
    duration_minutes: event?.duration_minutes || 60,
    status: event?.status || 'pending',
    sync_google: event?.sync_google || false,
    sync_outlook: event?.sync_outlook || false,
    whatsapp_reminder: event?.whatsapp_reminder || false,
    reminder_before_minutes: event?.reminder_before_minutes || 15,
  })

  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.event_date) errs.event_date = 'Date is required'
    if (!form.event_time) errs.event_time = 'Time is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit(form)
  }

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        id="ev-title"
        value={form.title}
        onChange={(e) => update('title', e.target.value)}
        error={errors.title}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date"
          id="ev-date"
          type="date"
          value={form.event_date}
          onChange={(e) => update('event_date', e.target.value)}
          error={errors.event_date}
          required
        />
        <Input
          label="Time"
          id="ev-time"
          type="time"
          value={form.event_time}
          onChange={(e) => update('event_time', e.target.value)}
          error={errors.event_time}
          required
        />
      </div>

      <Input
        label="Duration (minutes)"
        id="ev-duration"
        type="number"
        min={5}
        value={form.duration_minutes}
        onChange={(e) => update('duration_minutes', parseInt(e.target.value) || 60)}
      />

      {event && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Change status
            <span
              className={`ml-2 inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[form.status] || STATUS_STYLES.pending}`}
            >
              {STATUS_OPTIONS.find((s) => s.value === form.status)?.label || 'Pending'}
            </span>
          </label>
          <select
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
            className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {integrations?.google?.connected && (
        <Checkbox
          id="sync-google"
          label="Sync with Google Calendar"
          checked={form.sync_google}
          onChange={(v) => update('sync_google', v)}
        />
      )}

      {integrations?.outlook?.connected && (
        <Checkbox
          id="sync-outlook"
          label="Sync with Outlook Calendar"
          checked={form.sync_outlook}
          onChange={(v) => update('sync_outlook', v)}
        />
      )}

      {integrations?.whatsapp?.connected && (
        <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors">
          <Checkbox
            id="whatsapp-reminder"
            label="Send reminder via WhatsApp"
            checked={form.whatsapp_reminder}
            onChange={(v) => update('whatsapp_reminder', v)}
          />
          {form.whatsapp_reminder && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Remind me</label>
              <select
                value={form.reminder_before_minutes}
                onChange={(e) => update('reminder_before_minutes', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
              >
                {REMINDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
         Cancel
        </Button>
        <Button type="submit">{event ? 'Update' : 'Create'} Event</Button>
      </div>
    </form>
  )
}
