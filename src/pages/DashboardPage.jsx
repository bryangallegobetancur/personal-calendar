import { useState, useMemo, useRef } from 'react'
import { format } from 'date-fns'
import { MonthView } from '../components/calendar/MonthView'
import { WeekView } from '../components/calendar/WeekView'
import { DayView } from '../components/calendar/DayView'
import { EventForm } from '../components/events/EventForm'
import { EventList } from '../components/events/EventList'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Sidebar } from '../components/layout/Sidebar'
import { OnboardingTour } from '../components/onboarding/OnboardingTour'
import { useEvents } from '../hooks/useEvents'
import { useIntegrations } from '../hooks/useIntegrations'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { downloadIcal, importIcal } from '../lib/icalUtils'
import { requestNotificationPermission, scheduleBrowserReminder } from '../lib/pushNotifications'

export function DashboardPage() {
  const { events, createEvent, updateEvent, deleteEvent, searchQuery, searchEvents, exportAllEvents, bulkImportEvents } = useEvents()
  const { integrations } = useIntegrations()
  const fileInputRef = useRef(null)
  const [view, setView] = useState('month')
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [viewDate, setViewDate] = useState(new Date())
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [onboardingDone, setOnboardingDone] = useState(false)

  const filteredEvents = useMemo(() => {
    let result = events
    if (filterStatus !== 'all') result = result.filter((e) => e.status === filterStatus)
    if (filterCategory !== 'all') result = result.filter((e) => e.category === filterCategory)
    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      result = result.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.category?.toLowerCase().includes(q)
      )
    }
    return result
  }, [events, filterStatus, filterCategory, searchText])

  const categories = useMemo(
    () => [...new Set(events.map((e) => e.category || 'default'))],
    [events]
  )

  const todayEvents = useMemo(
    () => events.filter((e) => e.event_date === format(new Date(), 'yyyy-MM-dd')),
    [events]
  )

  const upcomingEvents = useMemo(
    () =>
      [...events]
        .filter((e) => e.event_date >= format(new Date(), 'yyyy-MM-dd'))
        .sort((a, b) => a.event_date.localeCompare(b.event_date) || (a.event_time || '').localeCompare(b.event_time || ''))
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

  const handleMiniCalendarClick = (date) => {
    setViewDate(date)
  }

  const handleEventClick = (event) => {
    setSelectedDate('')
    setEditingEvent(event)
    setShowForm(true)
  }

  const handleSubmit = async (formData) => {
    try {
      if (editingEvent) {
        const result = await updateEvent(editingEvent.id, formData)
        if (result?.conflict) {
          alert('Time conflict detected with: ' + result.conflicts.map((c) => c.title).join(', '))
          return
        }
      } else {
        const result = await createEvent({ ...formData })
        if (result?.conflict) {
          alert('Time conflict detected with: ' + result.conflicts.map((c) => c.title).join(', '))
          return
        }
        if (result?.data && (formData.whatsapp_reminder || formData.email_reminder)) {
          scheduleBrowserReminder({ ...result.data, reminder_before_minutes: formData.reminder_before_minutes || 15 })
        }
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

  const handleExport = () => {
    const allEvents = exportAllEvents()
    downloadIcal(allEvents, 'personal-calendar.ics')
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const imported = await importIcal(file)
      await bulkImportEvents(imported)
      alert(`Imported ${imported.length} events`)
    } catch (err) {
      console.error('Import error:', err)
      alert('Error importing events')
    }
    e.target.value = ''
  }

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission()
    if (granted) {
      alert('Browser notifications enabled!')
    } else {
      alert('Please allow notifications in your browser settings.')
    }
  }

  useKeyboardShortcuts({
    n: () => { setEditingEvent(null); setSelectedDate(format(new Date(), 'yyyy-MM-dd')); setShowForm(true) },
    t: () => { setView('day') },
    d: () => setView('day'),
    w: () => setView('week'),
    m: () => setView('month'),
    l: () => setView('list'),
    '/': () => document.getElementById('search-input')?.focus(),
  })

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  }

  return (
    <div className="flex">
      {!onboardingDone && (
        <OnboardingTour onComplete={() => setOnboardingDone(true)} />
      )}

      <Sidebar
        integrations={integrations}
        events={events}
        onMiniCalendarClick={handleMiniCalendarClick}
      />

      <main className="dashboard-main flex-1 min-w-0 ml-0 lg:ml-[280px] max-w-[1600px]">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-sm font-medium text-primary mb-1">Your schedule</p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Calendar overview</h1>
            <p className="text-sm text-muted-foreground mt-1">Keep your appointments and reminders in sync.</p>
          </div>
          <div className="hidden sm:block text-right text-sm text-muted-foreground">
            <div className="font-semibold text-foreground">{format(new Date(), 'EEEE, MMM d')}</div>
            <div>{format(new Date(), 'yyyy')}</div>
          </div>
        </div>
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex gap-1 p-1 bg-muted rounded-xl" data-onboarding="view-switcher">
            {['day', 'week', 'month', 'list'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  view === v
                    ? 'bg-card text-foreground shadow-sm border-transparent'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="search-input"
                type="text"
                placeholder="Search events..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="dashboard-control pl-9 pr-3 text-sm w-44"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="dashboard-control px-3 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {categories.length > 1 && (
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="dashboard-control px-3 text-sm"
              >
                <option value="all">All Categories</option>
                {categories.filter((c) => c !== 'all').map((cat) => (
                  <option key={cat} value={cat} className="capitalize">{cat}</option>
                ))}
              </select>
            )}
            <button
              onClick={handleExport}
              className="dashboard-control px-3 text-sm"
              title="Export to iCal"
            >
              Export
            </button>
            <label className="dashboard-control px-3 text-sm cursor-pointer">
              Import
              <input ref={fileInputRef} type="file" accept=".ics,.ical" onChange={handleImport} className="hidden" />
            </label>
            <button
              onClick={handleEnableNotifications}
              className="dashboard-control px-3 text-sm"
              title="Enable browser push notifications"
            >
              Notifications
            </button>
            <button
              onClick={() => { setEditingEvent(null); setSelectedDate(format(new Date(), 'yyyy-MM-dd')); setShowForm(true) }}
              className="inline-flex items-center gap-1.5 min-h-11 px-5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold shadow-sm hover:brightness-110 transition-all active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              data-onboarding="new-event"
            >
              + New Event
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="mb-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="shortcut-chip">N = New event</span>
          <span className="shortcut-chip">T = Today</span>
          <span className="shortcut-chip">D = Day</span>
          <span className="shortcut-chip">W = Week</span>
          <span className="shortcut-chip">M = Month</span>
          <span className="shortcut-chip">L = List</span>
          <span className="shortcut-chip">/ = Search</span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="dashboard-stat">
            <div className="text-xs text-muted-foreground mb-1">Total Events</div>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          </div>
          <div className="dashboard-stat">
            <div className="text-xs text-muted-foreground mb-1">This Week</div>
            <div className="text-2xl font-bold text-foreground">{stats.weekEvents}</div>
          </div>
          <div className="dashboard-stat">
            <div className="text-xs text-muted-foreground mb-1">Completion Rate</div>
            <div className="text-2xl font-bold text-green-500">{stats.completionRate}%</div>
          </div>
          <div className="dashboard-stat">
            <div className="text-xs text-muted-foreground mb-1">Integrations Active</div>
            <div className="text-2xl font-bold text-foreground">{stats.connectedInts}/{stats.totalInts}</div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="dashboard-panel calendar-surface">
          {view === 'day' && (
            <DayView events={filteredEvents} onDateClick={handleDateClick} onEventClick={handleEventClick} selectedDate={format(viewDate, 'yyyy-MM-dd')} />
          )}
          {view === 'month' && (
            <MonthView events={filteredEvents} onDateClick={handleDateClick} onEventClick={handleEventClick} selectedDate={format(viewDate, 'yyyy-MM-dd')} />
          )}
          {view === 'week' && (
            <WeekView events={filteredEvents} onDateClick={handleDateClick} onEventClick={handleEventClick} selectedDate={format(viewDate, 'yyyy-MM-dd')} />
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
            <h2 className="text-base font-semibold text-foreground mb-3">Upcoming Events</h2>
            <div className="dashboard-panel overflow-hidden">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-b-0 cursor-pointer hover:bg-accent transition-colors"
                >
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: event.color || (event.status === 'pending' ? '#f59e0b' : event.status === 'completed' ? '#22c55e' : '#ef4444') }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      {event.title}
                      {event.category && event.category !== 'default' && (
                        <span className="text-[10px] px-1 py-0.5 rounded bg-surface-2 text-muted-foreground capitalize">{event.category}</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {event.event_date} &middot; {event.event_time?.slice(0, 5) || 'All day'}
                    </div>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColors[event.status] || statusColors.pending}`}>
                    {event.status}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
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
            event={editingEvent || (selectedDate ? { event_date: selectedDate } : null)}
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
