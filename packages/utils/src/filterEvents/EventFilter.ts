import { EventClass } from '@full-event-calendar/shared-ts'
import { extractMonthDates, filterEventsByDateRange, getEventsInDate, getWeekDates, sortEventByStart } from '../'

interface Handle {
  proccess: (eventList: EventClass[], initDate: Date, calendar?: string, firstDay?: number) => EventClass[]
}

class Daily implements Handle {
  proccess(eventList: EventClass[], initDate: Date) {
    return getEventsInDate(eventList, initDate)
  }
}

class Weekly implements Handle {
  proccess(eventList: EventClass[], initDate: Date, _calendar?: string, firstDay: number = 0) {
    const weekDates = getWeekDates(initDate, firstDay)
    return filterEventsByDateRange(eventList, weekDates[0], weekDates[weekDates.length - 1]) as EventClass[]
  }
}

class Month implements Handle {
  proccess(eventList: EventClass[], initDate: Date, calendar: string = 'gregory') {
    const monthDates = extractMonthDates(initDate, calendar)
    return filterEventsByDateRange(
      eventList,
      monthDates[0].date,
      monthDates[monthDates.length - 1].date
    ) as EventClass[]
  }
}

type Modes = 'day' | 'week' | 'month'

abstract class Filter {
  protected handle: Handle
  constructor(mode: Modes) {
    switch (mode) {
      case 'day':
        this.handle = new Daily()
        break
      case 'week':
        this.handle = new Weekly()
        break
      case 'month':
        this.handle = new Month()
        break
    }
  }
}

export class EventModeFilter extends Filter {
  private calendar: string
  private initialDate: Date
  private firstDay: number
  constructor(mode: Modes, initialDate: Date, calendar: string = 'gregory', firstDay: number = 0) {
    super(mode)
    this.calendar = calendar
    this.initialDate = initialDate
    this.firstDay = firstDay
  }

  filter(eventList: EventClass[]): EventClass[] {
    return sortEventByStart(this.handle.proccess(eventList, this.initialDate, this.calendar, this.firstDay))
  }
}
