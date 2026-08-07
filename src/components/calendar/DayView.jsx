import { useState } from 'react'
import { format, addDays, subDays, isToday } from 'date-fns'
import { EventCard } from './EventCard'

const HOURS = Array.from({ length: 24 }, (_, i) => i)

export function DayView({ events, onDateClick, onEventClick }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getEventsForHour = (hour) =>
    events.filter((e) => {
      const eventDate = e.event_date
      const eventHour = parseInt(e.event_time?.split(':')[0], 10)
      return eventDate === format(currentDate, 'yyyy-MM-dd') && eventHour === hour
    })

  const allDayEvents = events.filter(
    (e) => e.is_all_day && e.event_date === format(currentDate, 'yyyy-MM-dd')
  )

  const multiDayEvents = events.filter(
    (e) =>
      e.end_date &&
      !e.is_all_day &&
      format(currentDate, 'yyyy-MM-dd') >= e.event_date &&
      format(currentDate, 'yyyy-MM-dd') <= e.end_date
  )

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentDate((d) => subDays(d, 1))}
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        >
          &larr; Prev Day
        </button>
        <h2 className={`text-lg font-semibold ${isToday(currentDate) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-gray-100'}`}>
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
          {isToday(currentDate) && <span className="ml-2 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">Today</span>}
        </h2>
        <button
          onClick={() => setCurrentDate((d) => addDays(d, 1))}
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        >
          Next Day &rarr;
        </button>
      </div>

      {allDayEvents.length > 0 && (
        <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">All Day</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {allDayEvents.map((ev) => (
              <EventCard key={ev.id} event={ev} onClick={() => onEventClick(ev)} compact />
            ))}
          </div>
        </div>
      )}

      {multiDayEvents.length > 0 && (
        <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <span className="text-xs font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider">Multi-day</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {multiDayEvents.map((ev) => (
              <EventCard key={ev.id} event={ev} onClick={() => onEventClick(ev)} compact />
            ))}
          </div>
        </div>
      )}

      <div className="overflow-auto max-h-[600px] border border-gray-200 dark:border-gray-800 rounded-lg">
        <div className="relative">
          {HOURS.map((hour) => {
            const hourEvents = getEventsForHour(hour)
            return (
              <div
                key={hour}
                onClick={() => onDateClick(format(currentDate, 'yyyy-MM-dd'))}
                className="flex border-b border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800/50 transition-colors min-h-[48px]"
              >
                <div className="w-16 flex-shrink-0 text-right pr-3 pt-2 text-xs text-gray-400 dark:text-gray-500 border-r border-gray-200 dark:border-gray-800">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
                <div className="flex-1 p-0.5">
                  {hourEvents.map((ev) => (
                    <EventCard key={ev.id} event={ev} onClick={() => onEventClick(ev)} compact />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
