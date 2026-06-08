import { useState } from 'react'
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addWeeks,
  subWeeks,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns'
import { EventCard } from './EventCard'

const HOURS = Array.from({ length: 24 }, (_, i) => i)

export function WeekView({ events, onDateClick, onEventClick }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const weekStart = startOfWeek(currentDate)
  const weekEnd = endOfWeek(currentDate)
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const getEventsForDayHour = (day, hour) =>
    events.filter((e) => {
      const eventDate = e.event_date
      const eventHour = parseInt(e.event_time.split(':')[0], 10)
      return eventDate === format(day, 'yyyy-MM-dd') && eventHour === hour
    })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentDate((d) => subWeeks(d, 1))}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          &larr; Prev Week
        </button>
        <h2 className="text-lg font-semibold">
          {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </h2>
        <button
          onClick={() => setCurrentDate((d) => addWeeks(d, 1))}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Next Week &rarr;
        </button>
      </div>

      <div className="overflow-auto max-h-[600px] border rounded-lg">
        <div className="grid grid-cols-8 min-w-[600px]">
          <div className="border-r bg-gray-50" />
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={`text-center p-1 text-xs font-medium border-r ${
                isToday(day) ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'
              }`}
            >
              {format(day, 'EEE d')}
            </div>
          ))}

          {HOURS.map((hour) => (
            <>
              <div key={`h-${hour}`} className="border-r border-b p-1 text-xs text-gray-400 text-right pr-2">
                {format(new Date().setHours(hour, 0, 0, 0), 'ha')}
              </div>
              {days.map((day) => {
                const dayEvents = getEventsForDayHour(day, hour)
                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    onClick={() => onDateClick(format(day, 'yyyy-MM-dd'))}
                    className="border-r border-b p-0.5 min-h-[40px] cursor-pointer hover:bg-blue-50"
                  >
                    {dayEvents.map((ev) => (
                      <EventCard key={ev.id} event={ev} onClick={() => onEventClick(ev)} compact />
                    ))}
                  </div>
                )
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  )
}
