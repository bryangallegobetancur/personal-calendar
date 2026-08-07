const DAY_NAMES = {
  sunday: 0, sun: 0,
  monday: 1, mon: 1,
  tuesday: 2, tue: 2, tues: 2,
  wednesday: 3, wed: 3,
  thursday: 4, thu: 4, thur: 4, thurs: 4,
  friday: 5, fri: 5,
  saturday: 6, sat: 6,
}

const MONTH_NAMES = {
  january: 0, jan: 0,
  february: 1, feb: 1,
  march: 2, mar: 2,
  april: 3, apr: 3,
  may: 3,
  june: 5, jun: 5,
  july: 6, jul: 6,
  august: 7, aug: 7,
  september: 8, sep: 8, sept: 8,
  october: 9, oct: 9,
  november: 10, nov: 10,
  december: 11, dec: 11,
}

function getNextDayOfWeek(dayIndex) {
  const today = new Date()
  const currentDay = today.getDay()
  let diff = dayIndex - currentDay
  if (diff <= 0) diff += 7
  const result = new Date(today)
  result.setDate(today.getDate() + diff)
  return result
}

function parseDate(text) {
  const lower = text.toLowerCase()

  if (lower.includes('today')) return new Date()
  if (lower.includes('tomorrow')) {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d
  }
  if (lower.includes('day after tomorrow')) {
    const d = new Date()
    d.setDate(d.getDate() + 2)
    return d
  }

  for (const [name, index] of Object.entries(DAY_NAMES)) {
    if (lower.includes(name)) {
      return getNextDayOfWeek(index)
    }
  }

  const dateMatch = text.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/)
  if (dateMatch) {
    const month = parseInt(dateMatch[1]) - 1
    const day = parseInt(dateMatch[2])
    const year = dateMatch[3] ? (dateMatch[3].length === 2 ? 2000 + parseInt(dateMatch[3]) : parseInt(dateMatch[3])) : new Date().getFullYear()
    return new Date(year, month, day)
  }

  const monthDayMatch = text.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)/i)
  if (monthDayMatch) {
    const day = parseInt(monthDayMatch[1])
    const monthName = monthDayMatch[2].toLowerCase()
    const month = MONTH_NAMES[monthName]
    if (month !== undefined) {
      const now = new Date()
      return new Date(now.getFullYear(), month, day)
    }
  }

  const monthDayMatch2 = text.match(/(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{1,2})(?:st|nd|rd|th)?/i)
  if (monthDayMatch2) {
    const monthName = monthDayMatch2[1].toLowerCase()
    const month = MONTH_NAMES[monthName]
    const day = parseInt(monthDayMatch2[2])
    if (month !== undefined) {
      const now = new Date()
      return new Date(now.getFullYear(), month, day)
    }
  }

  return null
}

function parseTime(text) {
  const timeMatch = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i)
  if (timeMatch) {
    let hours = parseInt(timeMatch[1])
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0
    const ampm = timeMatch[3].toLowerCase()
    if (ampm === 'pm' && hours < 12) hours += 12
    if (ampm === 'am' && hours === 12) hours = 0
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
  }

  const time24Match = text.match(/(\d{1,2}):(\d{2})(?!\s*(am|pm))/i)
  if (time24Match) {
    let hours = parseInt(time24Match[1])
    const minutes = parseInt(time24Match[2])
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
  }

  return null
}

export function parseNaturalLanguage(text) {
  const date = parseDate(text)
  const time = parseTime(text)

  let title = text

  const timePatterns = [
    /\d{1,2}(?::\d{2})?\s*(?:am|pm)/gi,
    /\d{1,2}:\d{2}/g,
    /today/gi,
    /tomorrow/gi,
    /day after tomorrow/gi,
    /next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi,
    /on\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi,
    /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi,
    /\d{1,2}\/\d{1,2}(?:\/\d{2,4})?/g,
    /\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(january|february|march|april|may|june|july|august|september|october|november|december)/gi,
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:st|nd|rd|th)?/gi,
    /\bat\b\s*/gi,
    /\bon\b\s*/gi,
  ]

  for (const pattern of timePatterns) {
    title = title.replace(pattern, '')
  }

  title = title.replace(/\s{2,}/g, ' ').trim()

  if (!title) title = 'New Event'

  return {
    title,
    date: date ? date.toISOString().slice(0, 10) : null,
    time,
  }
}
