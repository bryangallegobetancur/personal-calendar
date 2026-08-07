import { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Checkbox } from '../ui/Checkbox'
import { parseNaturalLanguage } from '../../lib/naturalLanguage'

const REMINDER_OPTIONS = [
  { value: 15, label: '15 minutes before' },
  { value: 30, label: '30 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 120, label: '2 hours before' },
  { value: 1440, label: '1 day before' },
  { value: 2880, label: '2 days before' },
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

const CATEGORIES = [
  { value: 'default', label: 'None', color: '#6b7280' },
  { value: 'work', label: 'Work', color: '#3b82f6' },
  { value: 'personal', label: 'Personal', color: '#8b5cf6' },
  { value: 'health', label: 'Health', color: '#22c55e' },
  { value: 'finance', label: 'Finance', color: '#f59e0b' },
  { value: 'social', label: 'Social', color: '#ec4899' },
  { value: 'travel', label: 'Travel', color: '#06b6d4' },
  { value: 'education', label: 'Education', color: '#ef4444' },
]

const RECURRENCE_OPTIONS = [
  { value: '', label: 'Does not repeat' },
  { value: 'daily:1', label: 'Daily' },
  { value: 'weekly:1', label: 'Weekly' },
  { value: 'monthly:1', label: 'Monthly' },
  { value: 'yearly:1', label: 'Yearly' },
  { value: 'daily:2', label: 'Every 2 days' },
  { value: 'weekly:2', label: 'Every 2 weeks' },
]

export function EventForm({ event, onSubmit, onCancel, integrations }) {
  const [form, setForm] = useState({
    title: event?.title || '',
    description: event?.description || '',
    event_date: event?.event_date || '',
    event_time: event?.event_time || '',
    end_date: event?.end_date || '',
    is_all_day: event?.is_all_day || false,
    duration_minutes: event?.duration_minutes || 60,
    status: event?.status || 'pending',
    category: event?.category || 'default',
    color: event?.color || null,
    recurrence_rule: event?.recurrence_rule || '',
    recurrence_end_date: event?.recurrence_end_date || '',
    sync_google: event?.sync_google || false,
    sync_outlook: event?.sync_outlook || false,
    whatsapp_reminder: event?.whatsapp_reminder || false,
    email_reminder: event?.email_reminder || false,
    reminder_before_minutes: event?.reminder_before_minutes || 15,
  })

  const [errors, setErrors] = useState({})
  const [conflictWarning, setConflictWarning] = useState(null)

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.event_date) errs.event_date = 'Date is required'
    if (!form.is_all_day && !form.event_time) errs.event_time = 'Time is required'
    if (form.end_date && form.end_date < form.event_date) errs.end_date = 'End date must be after start date'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const selectedCat = CATEGORIES.find((c) => c.value === form.category)
    const payload = { ...form, color: selectedCat?.color || null }
    if (!payload.end_date) payload.end_date = null
    if (!payload.recurrence_end_date) payload.recurrence_end_date = null
    if (!payload.recurrence_rule) payload.recurrence_rule = null
    onSubmit(payload)
  }

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleNaturalLanguage = () => {
    if (!form.title.trim()) return
    const parsed = parseNaturalLanguage(form.title)
    if (parsed.date || parsed.time) {
      const updates = {}
      if (!form.event_date && parsed.date) updates.event_date = parsed.date
      if (!form.event_time && parsed.time) updates.event_time = parsed.time
      if (parsed.title) updates.title = parsed.title
      setForm((prev) => ({ ...prev, ...updates }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Input
          label="Title"
          id="ev-title"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          onBlur={handleNaturalLanguage}
          error={errors.title}
          placeholder='e.g. "Dinner with Ana Friday at 8pm"'
          required
        />
        <button
          type="button"
          onClick={handleNaturalLanguage}
          className="absolute top-0 right-3 text-xs text-primary-500 hover:text-primary-600 dark:text-primary-400 mt-8"
          title="Parse natural language"
        >
          Auto
        </button>
      </div>

      {conflictWarning && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
          Time conflict with: {conflictWarning.map((c) => c.title).join(', ')}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
        />
      </div>

      <div className="flex items-center gap-4">
        <Checkbox
          id="ev-all-day"
          label="All day event"
          checked={form.is_all_day}
          onChange={(v) => update('is_all_day', v)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Date"
          id="ev-date"
          type="date"
          value={form.event_date}
          onChange={(e) => update('event_date', e.target.value)}
          error={errors.event_date}
          required
        />
        {!form.is_all_day && (
          <Input
            label="Time"
            id="ev-time"
            type="time"
            value={form.event_time}
            onChange={(e) => update('event_time', e.target.value)}
            error={errors.event_time}
            required
          />
        )}
        {form.is_all_day && (
          <Input
            label="End Date"
            id="ev-end-date"
            type="date"
            value={form.end_date}
            onChange={(e) => update('end_date', e.target.value)}
            error={errors.end_date}
          />
        )}
      </div>

      {!form.is_all_day && (
        <Input
          label="Duration (minutes)"
          id="ev-duration"
          type="number"
          min={5}
          value={form.duration_minutes}
          onChange={(e) => update('duration_minutes', parseInt(e.target.value) || 60)}
        />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
        <select
          value={form.category}
          onChange={(e) => update('category', e.target.value)}
          className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {!event?.parent_event_id && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Repeat</label>
            <select
              value={form.recurrence_rule}
              onChange={(e) => update('recurrence_rule', e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
            >
              {RECURRENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          {form.recurrence_rule && (
            <Input
              label="Repeat until"
              id="ev-recurrence-end"
              type="date"
              value={form.recurrence_end_date}
              onChange={(e) => update('recurrence_end_date', e.target.value)}
            />
          )}
        </>
      )}

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

      <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors">
        {integrations?.whatsapp?.connected && (
          <Checkbox
            id="whatsapp-reminder"
            label="Send reminder via WhatsApp"
            checked={form.whatsapp_reminder}
            onChange={(v) => update('whatsapp_reminder', v)}
          />
        )}
        <Checkbox
          id="email-reminder"
          label="Send reminder via Email"
          checked={form.email_reminder}
          onChange={(v) => update('email_reminder', v)}
        />
        {(form.whatsapp_reminder || form.email_reminder) && (
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

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
         Cancel
        </Button>
        <Button type="submit">{event?.id ? 'Update' : 'Create'} Event</Button>
      </div>
    </form>
  )
}
