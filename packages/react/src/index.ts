// main component
export { FullEventCalendar } from './components/FullEventCalendar'

// plugins ( re-exported with react friendly types )
export { DailyGridPlugin, WeeklyGridPlugin, MonthGridPlugin, ListPlugin } from './plugins'
export type { CalendarPlugin } from './plugins'

// default react components for every customizable calendar section
export * from './components/defaults'

// public types
export type {
  GridMode,
  ListMode,
  CalendarDirection,
  CalendarGroup,
  SourceCalendarEvent,
  CalendarEvent,
  EventUpdatePayload,
  EventAddPayload,
  AddEventStopedPayload,
  DateUpdatePayload,
  GridUpdatePayload,
  EventClickedPayload,
  TodayButtonSlotProps,
  GoBackButtonSlotProps,
  GoForwardButtonSlotProps,
  HeaderDateSlotProps,
  GridDropdownSlotProps,
  DailyHeaderSlotProps,
  TimeRangeSlotProps,
  GroupContainerSlotProps,
  EventItemSlotProps,
  MonthEventSlotProps,
  AllDayEventSlotProps,
  MonthDaySlotProps,
  MonthWeekDaySlotProps,
  ListDateHeaderSlotProps,
  ListEventSlotProps,
  EventClickModalSlotProps,
  AddEventModalSlotProps,
  SlotComponent,
  CalendarComponents,
  CalendarSlotName,
  CalendarApi,
  FullEventCalendarProps
} from './types'
