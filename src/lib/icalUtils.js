export function exportToIcal(events) {
  let ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Personal Calendar//EN',
  ]

  for (const event of events) {
    const startDate = event.event_date?.replace(/-/g, '')
    const startTime = event.event_time?.replace(/:/g, '') || '000000'

    ical.push('BEGIN:VEVENT')
    ical.push(`UID:${event.id}`)
    ical.push(`DTSTART:${startDate}T${startTime}`)

    if (event.is_all_day) {
      ical.push(`DTSTART;VALUE=DATE:${startDate}`)
    }

    if (event.end_date) {
      const endDate = event.end_date.replace(/-/g, '')
      ical.push(`DTEND;VALUE=DATE:${endDate}`)
    } else if (event.duration_minutes) {
      const dt = new Date(`${event.event_date}T${event.event_time}`)
      dt.setMinutes(dt.getMinutes() + event.duration_minutes)
      const endDateStr = dt.toISOString().slice(0, 10).replace(/-/g, '')
      const endTimeStr = dt.toTimeString().slice(0, 8).replace(/:/g, '')
      ical.push(`DTEND:${endDateStr}T${endTimeStr}`)
    }

    const summary = (event.title || '').replace(/[\\;,]/g, '\\$&')
    ical.push(`SUMMARY:${summary}`)

    if (event.description) {
      const desc = event.description.replace(/[\\;,]/g, '\\$&').replace(/\n/g, '\\n')
      ical.push(`DESCRIPTION:${desc}`)
    }

    if (event.category && event.category !== 'default') {
      ical.push(`CATEGORIES:${event.category}`)
    }

    if (event.recurrence_rule) {
      const [freq, interval] = event.recurrence_rule.split(':')
      const freqMap = { daily: 'DAILY', weekly: 'WEEKLY', monthly: 'MONTHLY', yearly: 'YEARLY' }
      let rule = `FREQ=${freqMap[freq] || freq.toUpperCase()}`
      if (interval && interval !== '1') rule += `;INTERVAL=${interval}`
      if (event.recurrence_end_date) {
        const until = event.recurrence_end_date.replace(/-/g, '')
        rule += `;UNTIL=${until}`
      }
      ical.push(`RRULE:${rule}`)
    }

    ical.push(`STATUS:${event.status === 'completed' ? 'CONFIRMED' : event.status === 'cancelled' ? 'CANCELLED' : 'TENTATIVE'}`)
    ical.push('END:VEVENT')
  }

  ical.push('END:VCALENDAR')
  return ical.join('\r\n')
}

export function downloadIcal(events, filename) {
  const content = exportToIcal(events)
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || 'personal-calendar.ics'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function parseIcalContent(content) {
  const events = []
  const lines = content.split(/\r?\n/)
  let current = null
  let inEvent = false

  const unfold = (line) => {
    if (line.startsWith(' ') || line.startsWith('\t')) return line.substring(1)
    return line
  }

  const folded = []
  for (const line of lines) {
    if (line.startsWith(' ') || line.startsWith('\t')) {
      folded[folded.length - 1] += unfold(line)
    } else {
      folded.push(line)
    }
  }

  for (const line of folded) {
    if (line.startsWith('BEGIN:VEVENT')) {
      inEvent = true
      current = {}
      continue
    }
    if (line.startsWith('END:VEVENT')) {
      inEvent = false
      if (current && current.title && current.event_date) {
        events.push(current)
      }
      current = null
      continue
    }
    if (!inEvent || !current) continue

    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue
    const key = line.substring(0, colonIdx)
    const value = line.substring(colonIdx + 1)

    if (key === 'SUMMARY') {
      current.title = value.replace(/\\[,;]/g, (m) => m[1])
    } else if (key === 'DESCRIPTION') {
      current.description = value.replace(/\\n/g, '\n').replace(/\\[,;]/g, (m) => m[1])
    } else if (key === 'DTSTART' || key.startsWith('DTSTART')) {
      if (key.includes('VALUE=DATE')) {
        current.event_date = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
        current.is_all_day = true
        current.event_time = '00:00:00'
      } else if (value.length >= 15) {
        current.event_date = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
        current.event_time = `${value.slice(9, 11)}:${value.slice(11, 13)}:${value.slice(13, 15)}`
      }
    } else if (key === 'DTEND' || key.startsWith('DTEND')) {
      if (!key.includes('VALUE=DATE') && value.length >= 8) {
        current.end_date = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
      }
    } else if (key === 'CATEGORIES') {
      current.category = value.toLowerCase()
    } else if (key === 'RRULE') {
      const freqMatch = value.match(/FREQ=(\w+)/i)
      const intervalMatch = value.match(/INTERVAL=(\d+)/i)
      const untilMatch = value.match(/UNTIL=(\d{8})/i)
      if (freqMatch) {
        const freqMap = { DAILY: 'daily', WEEKLY: 'weekly', MONTHLY: 'monthly', YEARLY: 'yearly' }
        const freq = freqMap[freqMatch[1].toUpperCase()] || freqMatch[1].toLowerCase()
        current.recurrence_rule = intervalMatch ? `${freq}:${intervalMatch[1]}` : freq
        if (untilMatch) {
          current.recurrence_end_date = `${untilMatch[1].slice(0, 4)}-${untilMatch[1].slice(4, 6)}-${untilMatch[1].slice(6, 8)}`
        }
      }
    } else if (key === 'STATUS') {
      if (value === 'CONFIRMED') current.status = 'completed'
      else if (value === 'CANCELLED') current.status = 'cancelled'
      else current.status = 'pending'
    }
  }

  return events
}

export function importIcal(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const events = parseIcalContent(e.target.result)
        resolve(events)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
