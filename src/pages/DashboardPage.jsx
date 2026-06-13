import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { MonthView } from '../components/calendar/MonthView'
import { WeekView } from '../components/calendar/WeekView'
import { EventForm } from '../components/events/EventForm'
import { EventList } from '../components/events/EventList'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Sidebar } from '../components/layout/Sidebar'
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

  const todayEvents = useMemo(
    () => events.filter((e) => e.event_date === format(new Date(), 'yyyy-MM-dd')),
    [events]
  )

  const upcomingEvents = useMemo(
    () =>
      [...events]
        .filter((e) => e.event_date >= format(new Date(), 'yyyy-MM-dd'))
        .sort((a, b) => a.event_date.localeCompare(b.event_date) || a.event_time?.localeCompare(b.event_time))
        .slice(0, 5),
    [events]
  )

  const stats = useMemo(() => {
    const total = events.length
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const weekEvents = events.filter((e) => new Date(e.event_date) >= weekStart).length
    const completed = events.filter((e) => e.status === 'completed').length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    const connectedInts = Object.values(integrations || {}).filter((i) => i?.connected).length
    const totalInts = 3
    return { total, weekEvents, completionRate, connectedInts, totalInts }
  }, [events, integrations])

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

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  }

  const dotColors = {
    pending: 'bg-amber-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-500',
  }

  return (
    <div className="flex">
      <Sidebar integrations={integrations} />

      <main className="flex-1 ml-0 lg:ml-[280px] p-6 max-w-[calc(100vw-280px)]">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex gap-1">
            {['month', 'week', 'list'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  view === v
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => { setEditingEvent(null); setSelectedDate(''); setShowForm(true) }}
              className="inline-flex items-center gap-1.5 h-10 px-5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              + New Event
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 transition-colors">
            <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">Total Events</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</div>
            <div className="text-xs text-green-500 mt-0.5 flex items-center gap-1">&uarr; vs last month</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 transition-colors">
            <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">This Week</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.weekEvents}</div>
            <div className="text-xs text-green-500 mt-0.5 flex items-center gap-1">&uarr; more than last week</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 transition-colors">
            <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">Completion Rate</div>
            <div className="text-2xl font-bold text-green-500">{stats.completionRate}%</div>
            <div className="text-xs text-green-500 mt-0.5 flex items-center gap-1">&uarr; improvement</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 transition-colors">
            <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">Integrations Active</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.connectedInts}/{stats.totalInts}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {stats.connectedInts < stats.totalInts ? 'Some disconnected' : 'All connected'}
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
          {view === 'month' && (
            <MonthView events={filteredEvents} onDateClick={handleDateClick} onEventClick={handleEventClick} />
          )}
          {view === 'week' && (
            <WeekView events={filteredEvents} onDateClick={handleDateClick} onEventClick={handleEventClick} />
          )}
          {view === 'list' && (
            <div className="p-4">
              <EventList events={filteredEvents} onEventClick={handleEventClick} />
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mt-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Upcoming Events</h2>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
              {upcomingEvents.map((event, i) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotColors[event.status] || 'bg-blue-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{event.title}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {event.event_date} &middot; {event.event_time?.slice(0, 5) || ''}
                    </div>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColors[event.status] || statusColors.pending}`}>
                    {event.status}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                    {event.event_time?.slice(0, 5) || ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event Form Modal */}
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
      </main>
    </div>
  )
}
