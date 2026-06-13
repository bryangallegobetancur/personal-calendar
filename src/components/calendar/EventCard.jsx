export function EventCard({ event, onClick, compact }) {
  const statusColors = {
    pending: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  if (compact) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation()
          onClick?.()
        }}
        className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded px-1 py-0.5 truncate cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
        title={event.title}
      >
        {event.event_time?.slice(0, 5)} {event.title}
      </div>
    )
  }

  return (
    <div
      onClick={() => onClick?.(event)}
      className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{event.title}</h3>
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
