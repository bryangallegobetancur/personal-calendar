import { useState } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
} from 'date-fns'
import { EventCard } from './EventCard'

export function MonthView({ events, onDateClick, onEventClick }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calStart = startOfWeek(monthStart)
  const calEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const getEventsForDay = (day) =>
    events.filter((e) => e.event_date === format(day, 'yyyy-MM-dd'))

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentDate((d) => subMonths(d, 1))}
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        >
          &larr; Prev
        </button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{format(currentDate, 'MMMM yyyy')}</h2>
        <button
          onClick={() => setCurrentDate((d) => addMonths(d, 1))}
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        >
          Next &rarr;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="bg-gray-50 dark:bg-gray-800/50 p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
            {d}
          </div>
        ))}

        {days.map((day) => {
          const dayEvents = getEventsForDay(day)
          const isCurrentMonth = isSameMonth(day, currentDate)

          return (
            <div
              key={day.toISOString()}
              onClick={() => onDateClick(format(day, 'yyyy-MM-dd'))}
              className={`bg-white dark:bg-gray-900 p-1 min-h-[80px] cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors ${
                !isCurrentMonth ? 'opacity-40' : ''
              } ${isToday(day) ? 'bg-blue-50 dark:bg-gray-800' : ''}`}
            >
              <span
                className={`inline-flex items-center justify-center w-6 h-6 text-xs rounded-full ${
                  isToday(day) ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {format(day, 'd')}
              </span>
              <div className="space-y-0.5 mt-0.5">
                {dayEvents.slice(0, 3).map((ev) => (
                  <EventCard key={ev.id} event={ev} onClick={() => onEventClick(ev)} compact />
                ))}
                {dayEvents.length > 3 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 pl-1">+{dayEvents.length - 3} more</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
