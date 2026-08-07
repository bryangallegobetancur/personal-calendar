export function EventCard({ event, onClick, compact }) {
  const statusColors = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
  }

  const dotColors = {
    pending: 'bg-amber-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-500',
  }

  const categoryColor = event.color || dotColors[event.status] || dotColors.pending

  if (compact) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation()
          onClick?.()
        }}
        data-category={event.category || 'default'}
        className={`calendar-event text-xs rounded px-1 py-0.5 truncate cursor-pointer flex items-center gap-1 transition-colors ${event.is_all_day ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200' : statusColors[event.status] || statusColors.pending} hover:opacity-80`}
        title={`${event.title}${event.category && event.category !== 'default' ? ` [${event.category}]` : ''}${event.recurrence_rule ? ' (recurring)' : ''}`}
      >
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: categoryColor }} />
        <span className="truncate font-medium">
          {event.is_all_day ? '' : `${event.event_time?.slice(0, 5)} `}{event.title}
        </span>
        {event.recurrence_rule && (
          <svg className="w-3 h-3 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )}
      </div>
    )
  }

  return (
    <div
      onClick={() => onClick?.(event)}
      data-category={event.category || 'default'}
      className="calendar-event p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: categoryColor }} />
          {event.title}
          {event.is_all_day && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">All day</span>
          )}
        </h3>
        <div className="flex items-center gap-1.5">
          {event.category && event.category !== 'default' && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 capitalize">{event.category}</span>
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[event.status] || statusColors.pending}`}>
            {event.status}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {event.event_date}
        {!event.is_all_day && event.event_time ? ` at ${event.event_time?.slice(0, 5)}` : ''}
        {event.end_date ? ` - ${event.end_date}` : ''}
        {event.duration_minutes && !event.is_all_day ? ` (${event.duration_minutes} min)` : ''}
      </p>
      {event.recurrence_rule && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 capitalize">{event.recurrence_rule.replace(':', ' every ').replace('daily:1', 'daily').replace('weekly:1', 'weekly').replace('monthly:1', 'monthly').replace('yearly:1', 'yearly').replace(':1', '').replace(':2', 'every 2 ')}</p>
      )}
      {event.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{event.description}</p>
      )}
      <div className="flex gap-2 mt-2">
        {event.sync_google && <span className="text-xs text-blue-500 dark:text-blue-400">Google</span>}
        {event.sync_outlook && <span className="text-xs text-purple-500 dark:text-purple-400">Outlook</span>}
        {event.whatsapp_reminder && <span className="text-xs text-green-500 dark:text-green-400">WhatsApp</span>}
        {event.email_reminder && <span className="text-xs text-orange-500 dark:text-orange-400">Email</span>}
      </div>
    </div>
  )
}
