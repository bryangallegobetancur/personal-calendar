const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || ''

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const result = await Notification.requestPermission()
  if (result === 'granted') {
    if ('serviceWorker' in navigator && VAPID_PUBLIC_KEY) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        })
        return subscription
      } catch {
        return false
      }
    }
    return true
  }
  return false
}

export function showBrowserNotification(title, options = {}) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  return new Notification(title, {
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    ...options,
  })
}

export function scheduleBrowserReminder(event) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return

  const eventDate = new Date(`${event.event_date}T${event.event_time}`)
  const reminderBefore = event.reminder_before_minutes || 15
  const reminderTime = new Date(eventDate.getTime() - reminderBefore * 60000)
  const now = new Date()

  if (reminderTime <= now) return

  const timeout = reminderTime.getTime() - now.getTime()
  return setTimeout(() => {
    showBrowserNotification(`Reminder: ${event.title}`, {
      body: `Scheduled for ${event.event_date} at ${event.event_time?.slice(0, 5)}${event.description ? `\n${event.description}` : ''}`,
      requireInteraction: true,
    })
  }, timeout)
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
