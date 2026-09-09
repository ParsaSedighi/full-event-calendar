import { createMutable } from 'solid-js/store'
import { columData } from './WeeklyGrid'
import { batch, createEffect, createMemo } from 'solid-js'
import { getEventsInDate, getFirstDayOfWeek } from '@roozaneh/utils'

export function useWeekCols(mergedProps: any, onDateChange: any) {
  // first day of the week is resolved from the locale (fa-IR weeks start on Saturday)
  const firstDay = createMemo(() => getFirstDayOfWeek(mergedProps.locale))

  // Group Grid component takes a data for each grid colum
  const columData = createMutable([
    { props: { events: [], initialDate: null, locale: null, timeZone: null, calendar: null } }, // day 0
    { props: { events: [], initialDate: null, locale: null, timeZone: null, calendar: null } }, // day 1
    { props: { events: [], initialDate: null, locale: null, timeZone: null, calendar: null } }, // day 2
    { props: { events: [], initialDate: null, locale: null, timeZone: null, calendar: null } }, // day 3
    { props: { events: [], initialDate: null, locale: null, timeZone: null, calendar: null } }, // day 4
    { props: { events: [], initialDate: null, locale: null, timeZone: null, calendar: null } }, // day 5
    { props: { events: [], initialDate: null, locale: null, timeZone: null, calendar: null } } // day 6
  ]) as unknown as columData[]

  const generateCols = createMemo(() => {
    let iniDay = new Date(mergedProps.initialDate)
    iniDay.setDate(iniDay.getDate() - ((iniDay.getDay() - firstDay() + 7) % 7))
    // Holds executing downstream computations within the block until the end to prevent unnecessary recalculation
    batch(() => {
      for (let i = 0; i < 7; i++) {
        // column index is the position of the day in a week that starts on `firstDay`
        // (fa-IR weeks start on Saturday so Saturday is column 0)
        // Instead of filtering list for each event we pass down the entire event list
        // because the Daily grid component will filter out the event for the given they
        // so we do Not need the filter out here to ... it will be overdo
        const extractedEvents = getEventsInDate(mergedProps.events, new Date(iniDay))
        columData[i].props.events = extractedEvents.filter((item) => !item.isAllDay())
        // set props for each colum that wil be passed to dailyGird package by GroupGrid Package
        columData[i].props.initialDate = new Date(iniDay)
        columData[i].props.gridDate = new Date(iniDay)
        columData[i].props.locale = mergedProps.locale
        columData[i].props.timeZone = mergedProps.timeZone
        columData[i].props.calendar = mergedProps.calendar
        columData[i].props.gridHeight = mergedProps.gridHeight
        columData[i].props.stopAddEvent = mergedProps.stopAddEvent
        columData[i].props.onEventClick = mergedProps.onEventClick
        columData[i].props.editable = mergedProps.editable
        columData[i].props.onDateChange = onDateChange
        // Increment day for the next colum
        iniDay.setDate(iniDay.getDate() + 1)
      }
    })
  })

  createEffect(generateCols)

  return { columData }
}
