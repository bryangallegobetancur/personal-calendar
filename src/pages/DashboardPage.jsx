import { useState, useMemo } from 'react'
import { MonthView } from '../components/calendar/MonthView'
import { WeekView } from '../components/calendar/WeekView'
import { EventForm } from '../components/events/EventForm'
import { EventList } from '../components/events/EventList'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { useEvents } from '../hooks/useEvents'
import { useIntegrations } from '../hooks/useIntegrations'

export function DashboardPage() {
  const { events, createEvent, updateEvent, deleteEvent } = useEvents()
  const { integrations } = useIntegrations()
  const [view, setView] = useState('month')
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredEvents = useMemo(() => {
    if (filterStatus === 'all') return events
    return events.filter((e) => e.status === filterStatus)
  }, [events, filterStatus])

  const handleDateClick = (date) => {
    setSelectedDate(date)
    setEditingEvent(null)
    setShowForm(true)
  }

  const handleEventClick = (event) => {
    setEditingEvent(event)
    setShowForm(true)
  }

  const handleSubmit = async (formData) => {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, formData)
      } else {
        await createEvent({ ...formData })
      }
      setShowForm(false)
      setEditingEvent(null)
    } catch (err) {
      console.error('Error saving event:', err)
    }
  }

  const handleDelete = async () => {
    if (!editingEvent) return
    if (!window.confirm('Are you sure you want to delete this event?')) return
    try {
      await deleteEvent(editingEvent.id)
      setShowForm(false)
      setEditingEvent(null)
    } catch (err) {
      console.error('Error deleting event:', err)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'month' ? 'primary' : 'secondary'}
            onClick={() => setView('month')}
          >
            Month
          </Button>
          <Button
            variant={view === 'week' ? 'primary' : 'secondary'}
            onClick={() => setView('week')}
          >
            Week
          </Button>
          <Button
            variant={view === 'list' ? 'primary' : 'secondary'}
            onClick={() => setView('list')}
          >
            List
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <Button onClick={() => { setEditingEvent(null); setSelectedDate(''); setShowForm(true) }}>
            + New Event
          </Button>
        </div>
      </div>

      {view === 'month' && (
        <MonthView events={filteredEvents} onDateClick={handleDateClick} onEventClick={handleEventClick} />
      )}
      {view === 'week' && (
        <WeekView events={filteredEvents} onDateClick={handleDateClick} onEventClick={handleEventClick} />
      )}
      {view === 'list' && (
        <EventList events={filteredEvents} onEventClick={handleEventClick} />
      )}

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditingEvent(null) }}
        title={editingEvent ? 'Edit Event' : 'Create Event'}
      >
        <EventForm
          event={editingEvent ? { ...editingEvent, event_date: selectedDate || editingEvent.event_date } : { event_date: selectedDate }}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditingEvent(null) }}
          integrations={integrations}
        />
        {editingEvent && (
          <div className="mt-2">
            <Button variant="danger" onClick={handleDelete} className="w-full">
              Delete Event
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
