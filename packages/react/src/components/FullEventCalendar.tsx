import React, { Component, ComponentType, createElement, createRef, isValidElement, PureComponent } from 'react'
import type { ReactElement } from 'react'
import { createPortal, flushSync } from 'react-dom'
import { Calendar } from '@full-event-calendar/core/dist/index.js'
import equal from 'fast-deep-equal'
import type {
  CalendarApi,
  CalendarComponents,
  CalendarSlotName,
  FullEventCalendarProps,
  GridMode,
  ListMode,
  SourceCalendarEvent,
  CalendarDirection,
  CalendarEvent
} from '../types'

const reactMajorVersion = parseInt(String(React.version).split('.')[0])
const syncRenderingByDefault = reactMajorVersion < 18

interface CalendarState {
  customRenderingMap: Map<string, any>
}

/**
 * the full event calendar as a react component.
 *
 * every section of the calendar can be customized by passing react
 * components - either directly as props or grouped in the `components` prop :
 *
 * ```tsx
 * <FullEventCalendar
 *   plugins={[DailyGridPlugin, WeeklyGridPlugin, MonthGridPlugin, ListPlugin]}
 *   events={events}
 *   components={{
 *     eventItem: (props) => <MyEventCard {...props} />,
 *     todayBtn: <MyTodayButton />,
 *   }}
 * />
 * ```
 *
 * the imperative api is available through `ref` / `onReady`.
 */
export class FullEventCalendar extends Component<FullEventCalendarProps, CalendarState> implements CalendarApi {
  static act = runNow // DEPRECATED. Not leveraged anymore

  private elRef = createRef<HTMLDivElement>()
  private calendar!: Calendar

  private isUpdating = false
  private isUnmounting = false
  private destroyTimer?: ReturnType<typeof setTimeout>

  state: CalendarState = {
    customRenderingMap: new Map<any, any>()
  }

  // -------------------------------------------------------------------------
  // imperative api ( CalendarApi ) - available via `ref` and `onReady`
  // -------------------------------------------------------------------------

  getEvents(): SourceCalendarEvent[] {
    return this.getInstance().storeManager.events.map((event: any) => event.sourceEvent)
  }
  getEventById(id: string | number): CalendarEvent | undefined {
    return this.getInstance().getEventById(id) as CalendarEvent | undefined
  }
  addEvent(event: SourceCalendarEvent): void {
    this.getInstance().addEvent(event)
  }
  updateEvent(id: any, event: SourceCalendarEvent): void {
    this.getInstance().updateEvent(id, event)
  }
  deleteEvent(id: string | number): void {
    this.getInstance().deleteEvent(id)
  }
  changeGrid(grid: GridMode): void {
    const calendar = this.getInstance()
    calendar.emitEvent('gridUpdate', { grid })
    calendar.changeGrid(grid)
  }
  changeTheme(theme: string): void {
    this.getInstance().changeTheme(theme)
  }
  changeLocale(locale: string): void {
    this.getInstance().changeLocale(locale)
  }
  changeCalendar(calendar: string): void {
    this.getInstance().changeCalendar(calendar)
  }
  changeTimeZone(timeZone: string): void {
    this.getInstance().changeTimeZone(timeZone)
  }
  changeDirection(direction: CalendarDirection): void {
    this.getInstance().changeDirection(direction)
  }
  updateListMode(listMode: ListMode): void {
    this.getInstance().updateListMode(listMode)
  }
  updateGroups(groups: any[]): void {
    this.getInstance().updateGroups(groups)
  }
  updateEditable(editable: boolean): void {
    this.getInstance().updateEditable(editable)
  }
  setGridHeight(gridHeight: number): void {
    this.getInstance().setGridHeight(gridHeight)
  }
  changeContainerHeight(containerHeight: number): void {
    this.getInstance().changeContainerHeight(containerHeight)
  }
  prev(): void {
    this.stepDate(-1)
  }
  next(): void {
    this.stepDate(1)
  }
  goToday(): void {
    this.navigate(new Date())
  }
  getDate(): Date {
    return new Date(this.getInstance().storeManager.initialDate)
  }
  getGrid(): GridMode {
    return this.getInstance().storeManager.grid as GridMode
  }
  refresh(): void {
    this.getInstance().refresh()
  }

  private getInstance(): Calendar {
    return this.calendar
  }

  private stepDate(direction: 1 | -1) {
    const store = this.getInstance().storeManager
    const d = new Date(store.initialDate)
    if (store.grid === 'daily') {
      d.setDate(d.getDate() + direction)
    } else if (store.grid === 'weekly') {
      d.setDate(d.getDate() + 7 * direction)
    } else if (store.grid === 'list') {
      if (store.listMode === 'day') {
        d.setDate(d.getDate() + direction)
      } else if (store.listMode === 'week') {
        d.setDate(d.getDate() + 7 * direction)
      } else {
        d.setMonth(d.getMonth() + direction)
      }
    } else {
      d.setMonth(d.getMonth() + direction)
    }
    this.navigate(d)
  }

  private navigate(date: Date) {
    const calendar = this.getInstance()
    calendar.emitEvent('dateUpdate', { date })
    calendar.changeInitialDate(date.toISOString())
  }

  // -------------------------------------------------------------------------
  // react lifecycle
  // -------------------------------------------------------------------------

  render() {
    const customRenderingNodes: JSX.Element[] = []

    for (const customRendering of this.state.customRenderingMap.values()) {
      if (!customRendering.target.el) continue
      const vnode = this.resolveSlotElement(customRendering.name)
      if (!vnode) continue

      customRenderingNodes.push(
        <CustomRenderingComponent
          key={customRendering.id}
          data={customRendering.data}
          target={customRendering.target}
          customRendering={vnode}
        />
      )
    }

    return <div ref={this.elRef}>{customRenderingNodes}</div>
  }

  componentDidMount() {
    const hasMoundted = !!this.calendar
    if (hasMoundted) {
      // the component was unmounted and mounted again in the same tick : this
      // is the simulated unmount/remount React 18 StrictMode performs in dev.
      // cancel the deferred destroy so the solid root stays alive
      clearTimeout(this.destroyTimer)
      this.destroyTimer = undefined
      this.isUnmounting = false
      return
    }
    this.calendar = new Calendar(this.elRef.current!, {
      events: this.props.events,
      gridHeight: this.props.gridHeight,
      timeZone: this.props.timeZone,
      calendar: this.props.calendar,
      locale: this.props.locale,
      direction: this.props.direction,
      initialDate: this.props.initialDate,
      plugins: this.props.plugins,
      stopAddEvent: this.props.stopAddEvent,
      autoUpdateEventOnChange: this.props.autoUpdateEventOnChange,
      grid: this.props.grid,
      listMode: this.props.listMode,
      groups: this.props.groups,
      editable: this.props.editable,
      theme: this.props.theme,
      containerHeight: this.props.containerHeight
    })
    let lastRequestTimestamp: number | undefined

    this.calendar.renderStore.subscribe(() => {
      const requestTimestamp = Date.now()
      const isMounting = !lastRequestTimestamp
      const runFunc =
        // don't call flushSync if React version already does sync rendering by default
        // guards against fatal errors:
        // https://github.com/fullcalendar/fullcalendar/issues/7448
        syncRenderingByDefault ||
        //
        isMounting ||
        this.isUpdating ||
        this.isUnmounting ||
        requestTimestamp - lastRequestTimestamp! < 100 // rerendering frequently
          ? runNow // either sync rendering (first-time or React 16/17) or async (React 18)
          : flushSync // guaranteed sync rendering
      this.calendar.renderStore.getState()

      runFunc(() => {
        this.setState({ customRenderingMap: this.calendar.renderStore.getState() }, () => {
          lastRequestTimestamp = requestTimestamp
        })
      })
    })

    this.registerListenrs()

    this.calendar.setAvalibleSlots(this.getSlotNames())
    this.calendar.render()
    if (this.props.onReady) this.props.onReady(this)
  }

  componentDidUpdate(preProps: FullEventCalendarProps) {
    if (!equal(this.props, preProps)) {
      // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
      this.isUpdating = true
      // slots must be registered BEFORE option changes : switching grids
      // mounts new sections that read the available slots on setup
      this.calendar.setAvalibleSlots(this.getSlotNames())
      this.calendar.resetOptions({
        ...this.props
      })
      this.isUpdating = false
    }
  }

  componentWillUnmount() {
    this.isUnmounting = true
    // React 18 StrictMode simulates an unmount right after mounting in dev
    // ( componentDidMount -> componentWillUnmount -> componentDidMount in the
    // same tick ). the REAL unmount is never followed by a remount : defer
    // the destroy and cancel it if the component mounts again
    this.destroyTimer = setTimeout(() => {
      this.destroyTimer = undefined
      try {
        this.calendar?.destroy?.()
      } catch {
        // calendar already destroyed
      }
    }, 0)
  }

  registerListenrs() {
    const self = this
    this.calendar.on('eventUpdate', (data: any) => {
      if (self.props.eventUpdate) self.props.eventUpdate(data)
      if (self.props.onEventUpdate) self.props.onEventUpdate(data)
    })
    this.calendar.on('eventAdd', (data: any) => {
      if (self.props.eventAdd) self.props.eventAdd(data)
      if (self.props.onEventAdd) self.props.onEventAdd(data)
    })
    this.calendar.on('gridUpdate', (data: any) => {
      if (self.props.gridUpdate) self.props.gridUpdate(data)
      if (self.props.onGridUpdate) self.props.onGridUpdate(data)
    })
    this.calendar.on('addEventStoped', (data: any) => {
      if (self.props.addEventStoped) self.props.addEventStoped(data)
      if (self.props.onAddEventStoped) self.props.onAddEventStoped(data)
    })
    this.calendar.on('dateUpdate', (data: any) => {
      if (self.props.dateUpdate) self.props.dateUpdate(data)
      if (self.props.onDateUpdate) self.props.onDateUpdate(data)
    })
    this.calendar.on('eventClicked', (data: any) => {
      if (self.props.eventClicked) self.props.eventClicked(data)
      if (self.props.onEventClick) self.props.onEventClick(data)
    })
  }

  // -------------------------------------------------------------------------
  // slot resolution : direct slot props win over the `components` map.
  // both react elements and component types are supported
  // -------------------------------------------------------------------------

  private getSlotNames(): string[] {
    const props = this.props as Record<string, unknown>
    const names = Object.keys(kebabToCamelKeys(props))
    const components = props.components as CalendarComponents | undefined
    if (components) {
      for (const key of Object.keys(components)) {
        if (!names.includes(key)) names.push(key)
      }
    }
    return names
  }

  private resolveSlotElement(name: string): ReactElement | null {
    const props = this.props as Record<string, unknown>
    const slot = props[name] ?? (props.components as CalendarComponents | undefined)?.[name as CalendarSlotName]
    return toSlotElement(slot)
  }
}

function toSlotElement(slot: unknown): ReactElement | null {
  if (slot === undefined || slot === null || slot === false) return null
  if (isValidElement(slot)) return slot
  if (typeof slot === 'function' || (typeof slot === 'object' && 'render' in (slot as object))) {
    return createElement(slot as ComponentType<any>)
  }
  return null
}

// Custom Rendering
// -------------------------------------------------------------------------------------------------

interface CustomRenderingComponentProps {
  customRendering: ReactElement
  target: any
  data: any
}

class CustomRenderingComponent extends PureComponent<CustomRenderingComponentProps> {
  render() {
    const { customRendering, data, target } = this.props
    const ndoe = React.cloneElement(customRendering, data)
    return createPortal(ndoe, target.el)
  }
}
// Util
// -------------------------------------------------------------------------------------------------
function kebabToCamelKeys<V>(map: { [key: string]: V }): { [key: string]: V } {
  const newMap: { [key: string]: V } = {}

  for (const key in map) {
    newMap[kebabToCamel(key)] = map[key]
  }

  return newMap
}

function kebabToCamel(s: string): string {
  return s
    .split('-')
    .map((word, index) => (index ? capitalize(word) : word))
    .join('')
}
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function runNow(f: () => void): void {
  f()
}
