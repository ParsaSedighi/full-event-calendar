import type { ComponentType, ReactElement } from 'react'
import type { CalendarSourceOptions } from '@full-event-calendar/core/dist/index.js'

// ---------------------------------------------------------------------------
// core option types (structurally identical to the calendar's own types so
// the published react types stay self contained)
// ---------------------------------------------------------------------------

export type GridMode = 'daily' | 'weekly' | 'month' | 'list'
export type ListMode = 'day' | 'week' | 'month'
export type CalendarDirection = 'rtl' | 'ltr' | 'auto'

export interface CalendarGroup {
  id: string | number
  name: string
  image?: unknown
}

/** an event as provided by the user */
export interface SourceCalendarEvent {
  id: any
  name: string
  start: Date
  end: Date
  color?: string
  groups?: number[] | string[]
}

/** an event instance as the calendar hands it back (slots , callbacks , api) */
export interface CalendarEvent {
  id: any
  name: string
  start: Date
  end: Date
  color: string
  groups?: (string | number)[]
  /** raw event the user originally provided */
  sourceEvent: SourceCalendarEvent
  isAllDay(): boolean
}

// ---------------------------------------------------------------------------
// event payloads (the 6 events emitted by the calendar)
// ---------------------------------------------------------------------------

export interface EventUpdatePayload {
  prev: CalendarEvent | null
  next: CalendarEvent
  id: any
}
export interface EventAddPayload {
  event: CalendarEvent
}
export interface AddEventStopedPayload {
  event: CalendarEvent
}
export interface DateUpdatePayload {
  date: Date
}
export interface GridUpdatePayload {
  grid: GridMode
}
export interface EventClickedPayload {
  event: CalendarEvent
}

// ---------------------------------------------------------------------------
// slot props. every customizable section of the calendar passes its data to
// the overriding react component through these props
// ---------------------------------------------------------------------------

/** class names appended to a slot component's root element ( tailwind utilities... ) */
export interface SlotClassNameProp {
  className?: string
}

/** header - the "today" button */
export interface TodayButtonSlotProps extends SlotClassNameProp {
  /** navigates the calendar to today */
  goToday?: () => void
  locale?: string
}
/** header - the go back arrow */
export interface GoBackButtonSlotProps extends SlotClassNameProp {
  /** navigates one step back (day / week / month based on the active grid) */
  goBack?: () => void
  locale?: string
}
/** header - the go forward arrow */
export interface GoForwardButtonSlotProps extends SlotClassNameProp {
  /** navigates one step forward (day / week / month based on the active grid) */
  goForward?: () => void
  locale?: string
}
/** header - the big formatted date text */
export interface HeaderDateSlotProps extends SlotClassNameProp {
  /** date text formatted with the active locale / calendar / time zone */
  date?: string
}
/** header - the grid picker dropdown */
export interface GridDropdownSlotProps extends SlotClassNameProp {
  grid?: GridMode
  /** grid names of every installed plugin */
  grids?: GridMode[]
  /** switches the calendar to the given grid */
  changeGrid?: (grid: GridMode) => void
  locale?: string
}
/** daily & weekly grids - one day column header */
export interface DailyHeaderSlotProps extends SlotClassNameProp {
  date?: Date
  /** click handler navigating the calendar to this date */
  onDateChange?: (d: Date) => void
  /** legacy alias of onDateChange */
  ondataChange?: (d: Date) => void
  locale?: string
  calendar?: string
  timeZone?: string
  isToday?: boolean
}
/** daily & weekly grids - one hour label of the time column */
export interface TimeRangeSlotProps extends SlotClassNameProp {
  /** a Date whose hour matters ('' for the top row) */
  time?: Date | string
  locale?: string
}
/** daily grid - one group (resource) header */
export interface GroupContainerSlotProps extends SlotClassNameProp {
  group?: CalendarGroup
}
/** daily & weekly grids - one timed event card content */
export interface EventItemSlotProps extends SlotClassNameProp {
  event?: CalendarEvent
  /** pre formatted time range text of the event */
  timeText?: string
  isAllDay?: boolean
  locale?: string
}
/** month grid & weekly all day row - one event card content */
export interface MonthEventSlotProps extends SlotClassNameProp {
  event?: CalendarEvent
  /** pre formatted short start time ( empty for all day events ) */
  timeText?: string
  isAllDay?: boolean
  locale?: string
}
/** daily grid - one all day event chip content */
export interface AllDayEventSlotProps extends SlotClassNameProp {
  event?: CalendarEvent
  locale?: string
}
/** month grid - one day cell content ( date number area ) */
export interface MonthDaySlotProps extends SlotClassNameProp {
  date?: Date
  /** day number formatted for the active locale / calendar */
  day?: string
  /** month name for dates of another month shown in the cell */
  monthName?: string
  isToday?: boolean
  isInsideMonth?: boolean
  locale?: string
  calendar?: string
}
/** month grid - one week day label of the month header */
export interface MonthWeekDaySlotProps extends SlotClassNameProp {
  date?: Date
  /** week day label formatted for the active locale / calendar */
  label?: string
  locale?: string
}
/** list grid - one date group header */
export interface ListDateHeaderSlotProps extends SlotClassNameProp {
  date?: Date
  /** day number text */
  day?: string
  /** week day text */
  weekdayText?: string
  events?: CalendarEvent[]
  locale?: string
  calendar?: string
}
/** list grid - one event row content */
export interface ListEventSlotProps extends SlotClassNameProp {
  event?: CalendarEvent
  /** pre formatted time range text ( or the all day label ) */
  timeText?: string
  locale?: string
  calendar?: string
}
/** modal shown when an event is clicked */
export interface EventClickModalSlotProps extends SlotClassNameProp {
  eventData?: CalendarEvent
  /** alias of eventData */
  event?: CalendarEvent
  /** closes the modal */
  saveModal?: () => void
  /** alias of saveModal */
  close?: () => void
  locale?: string
}
/** modal shown when an event is drag created while `stopAddEvent` is enabled */
export interface AddEventModalSlotProps extends SlotClassNameProp {
  eventData?: CalendarEvent
  /** alias of eventData */
  event?: CalendarEvent
  /** closes ( and confirms ) the modal */
  saveModal?: () => void
  /** alias of saveModal */
  close?: () => void
  locale?: string
}

// ---------------------------------------------------------------------------
// components map - customization made easy : pass either a react element or
// a component type for any section of the calendar
// ---------------------------------------------------------------------------

/** anything that can be used to override a calendar section */
export type SlotComponent<P = Record<string, unknown>> = ReactElement | ComponentType<P>

export interface CalendarComponents {
  /** header "today" button */
  todayBtn?: SlotComponent<TodayButtonSlotProps>
  /** header back arrow */
  goBackDate?: SlotComponent<GoBackButtonSlotProps>
  /** header forward arrow */
  goForwardDate?: SlotComponent<GoForwardButtonSlotProps>
  /** header date text */
  headerDateSlot?: SlotComponent<HeaderDateSlotProps>
  /** header grid picker */
  gridDropDown?: SlotComponent<GridDropdownSlotProps>
  /** day column header of the daily / weekly grids */
  dailyHeader?: SlotComponent<DailyHeaderSlotProps>
  /** hour label of the daily / weekly time column */
  timeRange?: SlotComponent<TimeRangeSlotProps>
  /** group ( resource ) header of the daily grid */
  groupContainer?: SlotComponent<GroupContainerSlotProps>
  /** timed event card content of the daily / weekly grids */
  eventItem?: SlotComponent<EventItemSlotProps>
  /** event card content of the month grid & the weekly all day row */
  monthEvent?: SlotComponent<MonthEventSlotProps>
  /** all day event chip content of the daily grid */
  allDayEvent?: SlotComponent<AllDayEventSlotProps>
  /** day cell content of the month grid */
  monthDay?: SlotComponent<MonthDaySlotProps>
  /** week day label of the month header */
  monthWeekDay?: SlotComponent<MonthWeekDaySlotProps>
  /** date group header of the list grid */
  listDateHeader?: SlotComponent<ListDateHeaderSlotProps>
  /** event row content of the list grid */
  listEvent?: SlotComponent<ListEventSlotProps>
  /** modal shown when an event is clicked */
  eventClick?: SlotComponent<EventClickModalSlotProps>
  /** modal shown when an event is drag created ( stopAddEvent ) */
  addModal?: SlotComponent<AddEventModalSlotProps>
}

/** every calendar section keyed by its slot name ( same names as CalendarComponents ) */
export type CalendarSlotName = keyof CalendarComponents

// ---------------------------------------------------------------------------
// imperative api exposed through `ref` / `onReady`
// ---------------------------------------------------------------------------

export interface CalendarApi {
  /** events currently in the calendar ( raw source events ) */
  getEvents(): SourceCalendarEvent[]
  /** event instance by id ( undefined when not found ) */
  getEventById(id: string | number): CalendarEvent | undefined
  addEvent(event: SourceCalendarEvent): void
  updateEvent(id: any, event: SourceCalendarEvent): void
  deleteEvent(id: string | number): void
  changeGrid(grid: GridMode): void
  changeTheme(theme: string): void
  changeLocale(locale: string): void
  changeCalendar(calendar: string): void
  changeTimeZone(timeZone: string): void
  changeDirection(direction: CalendarDirection): void
  updateListMode(listMode: ListMode): void
  updateGroups(groups: CalendarGroup[]): void
  updateEditable(editable: boolean): void
  setGridHeight(gridHeight: number): void
  changeContainerHeight(containerHeight: number): void
  /** navigates one step back ( day / week / month based on the active grid ) */
  prev(): void
  /** navigates one step forward */
  next(): void
  /** navigates to today */
  goToday(): void
  /** currently visible date */
  getDate(): Date
  /** active grid */
  getGrid(): GridMode
  /** re-renders the calendar root */
  refresh(): void
}

// ---------------------------------------------------------------------------
// FullEventCalendar props
// ---------------------------------------------------------------------------

export interface FullEventCalendarProps extends Omit<CalendarSourceOptions, 'avalibalSots'> {
  /** class names appended to the calendar root element ( e.g. tailwind utilities ) */
  className?: string

  /** customize any section of the calendar with react components */
  components?: CalendarComponents

  // slot props : each section can also be overridden directly
  todayBtn?: SlotComponent<TodayButtonSlotProps>
  goBackDate?: SlotComponent<GoBackButtonSlotProps>
  goForwardDate?: SlotComponent<GoForwardButtonSlotProps>
  headerDateSlot?: SlotComponent<HeaderDateSlotProps>
  gridDropDown?: SlotComponent<GridDropdownSlotProps>
  dailyHeader?: SlotComponent<DailyHeaderSlotProps>
  timeRange?: SlotComponent<TimeRangeSlotProps>
  groupContainer?: SlotComponent<GroupContainerSlotProps>
  eventItem?: SlotComponent<EventItemSlotProps>
  monthEvent?: SlotComponent<MonthEventSlotProps>
  allDayEvent?: SlotComponent<AllDayEventSlotProps>
  monthDay?: SlotComponent<MonthDaySlotProps>
  monthWeekDay?: SlotComponent<MonthWeekDaySlotProps>
  listDateHeader?: SlotComponent<ListDateHeaderSlotProps>
  listEvent?: SlotComponent<ListEventSlotProps>
  eventClick?: SlotComponent<EventClickModalSlotProps>
  addModal?: SlotComponent<AddEventModalSlotProps>

  // event callbacks ( legacy prop names )
  eventUpdate?: (payload: EventUpdatePayload) => void
  eventAdd?: (payload: EventAddPayload) => void
  addEventStoped?: (payload: AddEventStopedPayload) => void
  dateUpdate?: (payload: DateUpdatePayload) => void
  gridUpdate?: (payload: GridUpdatePayload) => void
  eventClicked?: (payload: EventClickedPayload) => void

  // event callbacks ( on* aliases )
  onEventUpdate?: (payload: EventUpdatePayload) => void
  onEventAdd?: (payload: EventAddPayload) => void
  onAddEventStoped?: (payload: AddEventStopedPayload) => void
  onDateUpdate?: (payload: DateUpdatePayload) => void
  onGridUpdate?: (payload: GridUpdatePayload) => void
  onEventClick?: (payload: EventClickedPayload) => void

  /** called once the calendar is mounted with its imperative api */
  onReady?: (api: CalendarApi) => void
}
