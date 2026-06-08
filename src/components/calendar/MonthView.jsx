import { useState, useEffect } from 'react'
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
  isSameDay,
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
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentDate((d) => subMonths(d, 1))}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          &larr; Prev
        </button>
        <h2 className="text-lg font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
        <button
          onClick={() => setCurrentDate((d) => addMonths(d, 1))}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Next &rarr;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="bg-gray-50 p-2 text-center text-xs font-medium text-gray-500">
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
              className={`bg-white p-1 min-h-[80px] cursor-pointer hover:bg-blue-50 transition-colors ${
                !isCurrentMonth ? 'opacity-40' : ''
              } ${isToday(day) ? 'bg-blue-50' : ''}`}
            >
              <span
                className={`inline-flex items-center justify-center w-6 h-6 text-xs rounded-full ${
                  isToday(day) ? 'bg-blue-600 text-white' : 'text-gray-700'
                }`}
              >
                {format(day, 'd')}
              </span>
              <div className="space-y-0.5 mt-0.5">
                {dayEvents.slice(0, 3).map((ev) => (
                  <EventCard key={ev.id} event={ev} onClick={() => onEventClick(ev)} compact />
                ))}
                {dayEvents.length > 3 && (
                  <p className="text-xs text-gray-400 pl-1">+{dayEvents.length - 3} more</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
