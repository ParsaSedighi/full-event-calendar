// official grid plugins re-exported with react friendly types so
// everything the calendar needs can be imported from '@full-event-calendar/react'
import { DailyGridPlugin as DailyGridPluginImpl } from '@full-event-calendar/daily-grid'
import { WeeklyGridPlugin as WeeklyGridPluginImpl } from '@full-event-calendar/weekly-grid'
import { MonthGridPlugin as MonthGridPluginImpl } from '@full-event-calendar/month-grid'
import { ListPlugin as ListPluginImpl } from '@full-event-calendar/list'
import type { GridMode } from './types'

/** a calendar grid plugin */
export interface CalendarPlugin {
  type: 'grid'
  name: GridMode
  code: unknown
}

/** daily grid plugin - day view with optional groups ( resources ) */
export const DailyGridPlugin: CalendarPlugin = DailyGridPluginImpl as CalendarPlugin
/** weekly grid plugin - 7 day view with an all day header row */
export const WeeklyGridPlugin: CalendarPlugin = WeeklyGridPluginImpl as CalendarPlugin
/** month grid plugin - month view with week rows */
export const MonthGridPlugin: CalendarPlugin = MonthGridPluginImpl as CalendarPlugin
/** list grid plugin - agenda list view */
export const ListPlugin: CalendarPlugin = ListPluginImpl as CalendarPlugin
