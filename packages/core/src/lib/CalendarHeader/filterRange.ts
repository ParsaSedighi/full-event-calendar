import { EventClass } from '@full-event-calendar/shared-ts'
import { CalendarState } from '../../store/store'
import { getCalendarMonthDays, getFirstDayOfWeek, getWeekDates } from '@full-event-calendar/utils'

interface Formater {
  proccess: (calendarState: CalendarState) => string
}

class DailyFormat implements Formater {
  constructor(private withWeekDay = false) {}
  proccess(calendarState: CalendarState) {
    const date = new Date(calendarState.initialDate)
    const options: any = {
      month: 'long',
      year: 'numeric',
      day: 'numeric',
      calendar: calendarState.calendar,
      timeZone: calendarState.timeZone
    }
    const formattedDate = new Intl.DateTimeFormat(calendarState.locale, options).format(date)
    if (!this.withWeekDay) {
      return formattedDate
    }
    const weekDayOptions: any = {
      weekday: 'long',
      calendar: calendarState.calendar,
      timeZone: calendarState.timeZone
    }
    const weekDay = new Intl.DateTimeFormat(calendarState.locale, weekDayOptions).format(date)
    return `${weekDay} ${formattedDate}`
  }
}

class WeeklyFormat implements Formater {
  proccess(calendarState: CalendarState) {
    const listWeekOptions: any = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      calendar: calendarState.calendar,
      timeZone: calendarState.timeZone
    }
    const weekends = getWeekDates(new Date(calendarState.initialDate), getFirstDayOfWeek(calendarState.locale))
    //@ts-ignore
    return new Intl.DateTimeFormat(calendarState.locale, listWeekOptions).formatRange(
      weekends[0],
      weekends[weekends.length - 1]
    ) as string
  }
}

class MonthFormat implements Formater {
  proccess(calendarState: CalendarState) {
    const options: any = {
      month: 'long',
      year: 'numeric',
      calendar: calendarState.calendar,
      timeZone: calendarState.timeZone
    }
    const parts = new Intl.DateTimeFormat(calendarState.locale, options).formatToParts(
      new Date(calendarState.initialDate)
    )
    // cldr writes the year before the month for some locale + calendar pairs
    // ( fa + persian ) even though the locale itself puts the month first :
    // swap the parts so the order always follows the locale's own convention
    const yearIndex = parts.findIndex((p) => p.type === 'year')
    const monthIndex = parts.findIndex((p) => p.type === 'month')
    if (yearIndex !== -1 && monthIndex !== -1 && yearIndex < monthIndex && writesMonthFirst(calendarState.locale)) {
      const yearPart = parts[yearIndex]
      parts[yearIndex] = parts[monthIndex]
      parts[monthIndex] = yearPart
    }
    return parts.map((p) => p.value).join('')
  }
}

// the gregorian patterns are the best localized reference of how a locale
// orders a month - year pair
function writesMonthFirst(locale: string): boolean {
  const parts = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    calendar: 'gregory'
  }).formatToParts()
  const year = parts.findIndex((p) => p.type === 'year')
  const month = parts.findIndex((p) => p.type === 'month')
  return month !== -1 && year !== -1 && month < year
}

class ListFormat implements Formater {
  proccess(calendarState: CalendarState) {
    if (calendarState.listMode === 'week') {
      return new WeeklyFormat().proccess(calendarState)
    }
    if (calendarState.listMode === 'month') {
      return new MonthFormat().proccess(calendarState)
    }
    return new DailyFormat().proccess(calendarState)
  }
}

export class HeaderFormat {
  protected handle: Formater
  private calendarSate: CalendarState
  constructor(calendarState: CalendarState) {
    this.calendarSate = calendarState
    switch (calendarState.grid) {
      case 'daily':
        this.handle = new DailyFormat(true)
        break
      case 'weekly':
        this.handle = new WeeklyFormat()
        break
      case 'month':
        this.handle = new MonthFormat()
        break
      case 'list':
        this.handle = new ListFormat()
        break
      default:
        this.handle = new DailyFormat()
        break
    }
  }

  format(): string {
    return this.handle.proccess(this.calendarSate)
  }
}
