import { useState } from 'react'
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from 'date-fns'
import { GoogleIcon, OutlookIcon, WhatsAppIcon } from '../ui/Icons'

export function Sidebar({ integrations }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calStart = startOfWeek(monthStart)
  const calEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const integrationsList = [
    { key: 'google', label: 'Google', icon: <GoogleIcon className="w-4 h-4" />, badgeClass: 'bg-[#4285F4]' },
    { key: 'outlook', label: 'Outlook', icon: <OutlookIcon className="w-4 h-4" />, badgeClass: 'bg-[#0078D4]' },
    { key: 'whatsapp', label: 'WhatsApp', icon: <WhatsAppIcon className="w-4 h-4" />, badgeClass: 'bg-[#25D366]' },
  ]

  const todayEvents = 4
  const weekEvents = 12
  const completedEvents = 8
  const pendingEvents = 5

  return (
    <aside className="w-[280px] flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 fixed top-16 bottom-0 transition-colors hidden lg:flex flex-col gap-6">
      {/* Mini Calendar */}
      <section>
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
          Calendar
        </h3>
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setCurrentDate((d) => subMonths(d, 1))}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-sm px-1"
          >
            &lsaquo;
          </button>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentDate((d) => addMonths(d, 1))}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-sm px-1"
          >
            &rsaquo;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-[2px] text-xs text-center">
          {dayNames.map((d) => (
            <span key={d} className="text-gray-400 dark:text-gray-500 font-medium py-1">{d}</span>
          ))}
          {days.map((day) => {
            const isOther = !isSameMonth(day, currentDate)
            const isTodayDay = isToday(day)
            return (
              <span
                key={day.toISOString()}
                className={`py-1 rounded-md cursor-pointer transition-colors ${
                  isTodayDay
                    ? 'bg-primary-600 text-white font-semibold'
                    : isOther
                      ? 'text-gray-300 dark:text-gray-600'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {format(day, 'd')}
              </span>
            )
          })}
        </div>
      </section>

      {/* Integrations */}
      <section>
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
          Integrations
        </h3>
        <div className="flex flex-col gap-1">
          {integrationsList.map(({ key, label, icon, badgeClass }) => {
            const connected = !!integrations?.[key]?.connected
            return (
              <div
                key={key}
                className="flex items-center justify-between px-2.5 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white ${badgeClass}`}
                  >
                    {icon}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{label}</span>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${
                    connected ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              </div>
            )
          })}
        </div>
      </section>

      {/* Quick Stats */}
      <section>
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
          Quick Stats
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-col gap-2">
          <div className="flex justify-between">
            <span>Events today</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{todayEvents}</span>
          </div>
          <div className="flex justify-between">
            <span>This week</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{weekEvents}</span>
          </div>
          <div className="flex justify-between">
            <span>Completed</span>
            <span className="font-semibold text-green-500">{completedEvents}</span>
          </div>
          <div className="flex justify-between">
            <span>Pending</span>
            <span className="font-semibold text-amber-500">{pendingEvents}</span>
          </div>
        </div>
      </section>
    </aside>
  )
}
