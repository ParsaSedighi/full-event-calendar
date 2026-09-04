import { EventClass } from '@full-event-calendar/shared-ts'
import { ceilDate, floorDate, getDayColumn } from '@full-event-calendar/utils'
import { createMemo } from 'solid-js'

/**
 * resolves the left position (column index) of an event in a week row.
 * `firstDay` is the first day of the week of the locale (fa-IR weeks start on Saturday)
 */
export function getLeftPosition(event: EventClass, weekStartDate: Date, firstDay: number = 0) {
  const floorWeekStart = floorDate(weekStartDate)
  if (event.start >= floorWeekStart) {
    return getDayColumn(event.start, firstDay)
  }
  return 0
}

export function getEndPosition(event: EventClass, weekendDate: Date, start: number, firstDay: number = 0) {
  if (event.isAllDay && !event.isAllDay()) return 1
  const floorDate = ceilDate(weekendDate)
  if (event.end <= floorDate) {
    return getDayColumn(event.end, firstDay) - start + 1
  }
  return 6 - start + 1
}

export function leftArrowClass(event: EventClass, weekStartDate: Date, leftArrowClass: boolean) {
  const floorWeekStart = floorDate(weekStartDate)
  if (event.start < floorWeekStart) {
    if (leftArrowClass) {
      return 'clip-path: polygon(100% 0, 10px 0, 0px 50%, 10px 100%, 100% 100%);'
    } else {
      return 'border-top-left-radius:0px;border-bottom-left-radius:0px;left:1px'
    }
  } else {
    return ''
  }
}

export function rightArrowClass(event: EventClass, weekendDate: Date) {
  const floorDate = ceilDate(weekendDate)
  return event.end > floorDate
}

interface eventRows {
  [key: string]: EventClass[]
}

export function getExtraRowsCount(
  eventRows: eventRows,
  weekStartDate: Date,
  weekendDate: Date,
  rowLimit: number,
  firstDay: number = 0
) {
  let rowExtrasCount = [0, 0, 0, 0, 0, 0, 0]
  const arr = Object.keys(eventRows).filter((_, i) => {
    return i + 1 > rowLimit
  })

  for (let index = 0; index < arr.length; index++) {
    const events = eventRows[arr[index]]
    // console.log(events)
    for (let j = 0; j < events.length; j++) {
      const event = events[j]
      const leftP = createMemo(() => getLeftPosition(event, weekStartDate, firstDay))
      const width = getEndPosition(event, weekendDate, leftP(), firstDay)
      for (let k = leftP(); k < width + leftP(); k++) {
        rowExtrasCount[k] = rowExtrasCount[k] + 1
      }
    }
  }

  return rowExtrasCount
}
