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

  if (compact) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation()
          onClick?.()
        }}
        className={`text-xs rounded px-1 py-0.5 truncate cursor-pointer flex items-center gap-1 transition-colors ${statusColors[event.status] || statusColors.pending} hover:opacity-80`}
        title={event.title}
      >
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColors[event.status] || dotColors.pending}`} />
        <span className="truncate font-medium">{event.event_time?.slice(0, 5)} {event.title}</span>
      </div>
    )
  }

  return (
    <div
      onClick={() => onClick?.(event)}
      className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotColors[event.status] || dotColors.pending}`} />
          {event.title}
        </h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[event.status] || statusColors.pending}`}>
          {event.status}
        </span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {event.event_date} at {event.event_time?.slice(0, 5)}
        {event.duration_minutes ? ` (${event.duration_minutes} min)` : ''}
      </p>
      {event.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{event.description}</p>
      )}
      <div className="flex gap-2 mt-2">
        {event.sync_google && <span className="text-xs text-blue-500 dark:text-blue-400">Google</span>}
        {event.sync_outlook && <span className="text-xs text-purple-500 dark:text-purple-400">Outlook</span>}
        {event.whatsapp_reminder && <span className="text-xs text-green-500 dark:text-green-400">WhatsApp</span>}
      </div>
    </div>
  )
}
