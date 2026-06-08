import { EventCard } from '../calendar/EventCard'

export function EventList({ events, onEventClick }) {
  if (!events.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No events found. Create one to get started!
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onClick={() => onEventClick(event)} />
      ))}
    </div>
  )
}
