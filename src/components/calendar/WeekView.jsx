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
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        >
          &larr; Prev Week
        </button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </h2>
        <button
          onClick={() => setCurrentDate((d) => addWeeks(d, 1))}
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        >
          Next Week &rarr;
        </button>
      </div>

      <div className="overflow-auto max-h-[600px] border border-gray-200 dark:border-gray-800 rounded-lg transition-colors">
        <div className="grid grid-cols-8 min-w-[600px]">
          <div className="border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50" />
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={`text-center p-1 text-xs font-medium border-r border-gray-200 dark:border-gray-800 transition-colors ${
                isToday(day) ? 'bg-blue-50 dark:bg-gray-800 text-primary-600 dark:text-primary-400' : 'bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400'
              }`}
            >
              {format(day, 'EEE d')}
            </div>
          ))}

          {HOURS.map((hour) => (
            <>
              <div key={`h-${hour}`} className="border-r border-b border-gray-200 dark:border-gray-800 p-1 text-xs text-gray-400 dark:text-gray-500 text-right pr-2">
                {format(new Date().setHours(hour, 0, 0, 0), 'ha')}
              </div>
              {days.map((day) => {
                const dayEvents = getEventsForDayHour(day, hour)
                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    onClick={() => onDateClick(format(day, 'yyyy-MM-dd'))}
                    className="border-r border-b border-gray-200 dark:border-gray-800 p-0.5 min-h-[40px] cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
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
