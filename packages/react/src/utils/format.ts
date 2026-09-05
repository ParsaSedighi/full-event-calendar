// locale / calendar / time zone aware formatting helpers built on Intl so the
// react package never pulls solid-js into react code

export function safeFormat(
  date: Date | string | number | undefined,
  locale: string | undefined,
  calendar: string | undefined,
  options: Intl.DateTimeFormatOptions,
  timeZone?: string
): string {
  const d = date instanceof Date ? date : new Date(date as any)
  if (!d || isNaN(d.getTime())) return ''
  try {
    return new Intl.DateTimeFormat(locale || 'en-US', {
      ...(calendar ? { calendar } : {}),
      ...(timeZone ? { timeZone } : {}),
      ...options
    }).format(d)
  } catch {
    try {
      return new Intl.DateTimeFormat(locale || 'en-US', options).format(d)
    } catch {
      return ''
    }
  }
}

/** e.g "08:00" - hourCycle h23 like the built in time column */
export function formatShortTime(
  date: Date | string | number | undefined,
  locale?: string,
  calendar?: string,
  timeZone?: string
): string {
  return safeFormat(date, locale, calendar, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }, timeZone)
}

/** e.g "8:00 AM - 9:30 AM" like the built in event card */
export function formatTimeRange(
  start: Date | string | number | undefined,
  end: Date | string | number | undefined,
  locale?: string,
  timeZone?: string
): string {
  try {
    const fmt = new Intl.DateTimeFormat(locale || 'en-US', {
      ...(timeZone ? { timeZone } : {}),
      hour: 'numeric',
      minute: '2-digit'
    })
    return (fmt as any).formatRange(new Date(start as any), new Date(end as any))
  } catch {
    return ''
  }
}

export function formatDayNumber(date: Date | undefined, locale?: string, calendar?: string, timeZone?: string): string {
  return safeFormat(date, locale, calendar, { day: 'numeric' }, timeZone)
}

export function formatWeekDay(date: Date | undefined, locale?: string, calendar?: string, timeZone?: string): string {
  return safeFormat(date, locale, calendar, { weekday: 'short' }, timeZone)
}

export function formatDayName(date: Date | undefined, locale?: string, calendar?: string): string {
  return safeFormat(date, locale, calendar, { day: 'numeric' })
}

export function formatWeekdayName(date: Date | undefined, locale?: string, calendar?: string): string {
  return safeFormat(date, locale, calendar, { weekday: 'long' })
}

export function isSameDay(a?: Date, b?: Date): boolean {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function isToday(date?: Date): boolean {
  return isSameDay(date, new Date())
}
