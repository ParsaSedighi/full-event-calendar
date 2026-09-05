import { useCallback, useMemo, useRef, useState } from 'react'
import './App.css'
import {
  FullEventCalendar,
  DailyGridPlugin,
  WeeklyGridPlugin,
  MonthGridPlugin,
  ListPlugin,
  TodayButton,
  GoBackButton,
  GoForwardButton,
  GridDropdown,
  TimeRangeLabel,
  GroupContainer,
  AllDayEventCard,
  MonthWeekDayLabel,
  ListDateHeader
} from '@full-event-calendar/react'
import type { CalendarComponents } from '@full-event-calendar/react'
import '@full-event-calendar/core/dist/main.css'

import { demoGroups, makeEvents, makeRandomEvent, startOfToday } from './demo/data'
import type { DemoEvent } from './demo/data'
import {
  DemoAddEventModal,
  DemoDailyHeader,
  DemoEventClickModal,
  DemoEventItem,
  DemoHeaderDate,
  DemoListEvent,
  DemoMonthDay,
  DemoMonthEvent
} from './demo/Slots'

const PLUGINS = [DailyGridPlugin, WeeklyGridPlugin, MonthGridPlugin, ListPlugin]

const GRIDS = ['daily', 'weekly', 'month', 'list'] as const
const LOCALES = [
  'en-US',
  'en-GB',
  'de-DE',
  'fr-FR',
  'es-ES',
  'fa-IR',
  'ar-EG',
  'he-IL',
  'hi-IN',
  'ja-JP',
  'zh-CN',
  'ru-RU',
  'tr-TR',
  'ko-KR'
]
const CALENDARS = [
  'gregory',
  'persian',
  'islamic-umalqura',
  'hebrew',
  'chinese',
  'indian',
  'buddhist',
  'japanese',
  'coptic',
  'ethiopic',
  'iso8601',
  'roc'
]
const TIME_ZONES = Array.from(
  new Set([
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Berlin',
    'Asia/Tehran',
    'Asia/Tokyo',
    'Australia/Sydney'
  ])
)
const LIST_MODES = ['day', 'week', 'month'] as const

interface LogEntry {
  id: number
  time: string
  type: string
  detail: string
}

let logId = 0

function App() {
  // calendar options (every CalendarSourceOptions prop is covered)
  const [events, setEvents] = useState<DemoEvent[]>(() => makeEvents())
  const [initialDate, setInitialDate] = useState<Date>(() => startOfToday())
  const [grid, setGrid] = useState<(typeof GRIDS)[number]>('daily')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [locale, setLocale] = useState('fa-IR')
  const [calendarType, setCalendarType] = useState('persian')
  const [timeZone, setTimeZone] = useState(TIME_ZONES[0])
  const [listMode, setListMode] = useState<(typeof LIST_MODES)[number]>('week')
  const [editable, setEditable] = useState(true)
  const [stopAddEvent, setStopAddEvent] = useState(true)
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [gridHeight, setGridHeight] = useState(60 * 24)
  const [containerHeight, setContainerHeight] = useState(900)
  const [useGroups, setUseGroups] = useState(false)
  const [customize, setCustomize] = useState(true)

  const [log, setLog] = useState<LogEntry[]>([])

  // imperative api of the calendar ( next / prev / addEvent / changeGrid ... )
  const apiRef = useRef<FullEventCalendar | null>(null)

  const pushLog = useCallback((type: string, detail: string) => {
    setLog((prev) =>
      [
        {
          id: ++logId,
          time: new Date().toLocaleTimeString(),
          type,
          detail
        },
        ...prev
      ].slice(0, 60)
    )
  }, [])

  // -------------------------------------------------------------------------
  // calendar event listeners ( all 6 emitted events )
  // -------------------------------------------------------------------------

  const handleEventUpdate = useCallback(
    ({ next, id }: any) => {
      const updated = next?.sourceEvent
      setEvents((prev) => {
        const index = prev.findIndex((e) => e.id === id)
        if (index === -1 || !updated) return prev
        const copy = [...prev]
        copy[index] = updated
        return copy
      })
      pushLog('eventUpdate', `#${id} moved to ${updated?.start?.toLocaleString()}`)
    },
    [pushLog]
  )

  const handleEventAdd = useCallback(
    ({ event }: any) => {
      const added = event?.sourceEvent
      if (!added) return
      setEvents((prev) => (prev.some((e) => e.id === added.id) ? prev : [...prev, added]))
      pushLog('eventAdd', `"${added.name}" created`)
    },
    [pushLog]
  )

  const handleAddEventStoped = useCallback(
    ({ event }: any) => {
      pushLog('addEventStoped', `"${event?.name}" frozen, waiting for addModal`)
    },
    [pushLog]
  )

  const handleDateUpdate = useCallback(
    ({ date }: any) => {
      setInitialDate(new Date(date))
      pushLog('dateUpdate', new Date(date).toDateString())
    },
    [pushLog]
  )

  const handleGridUpdate = useCallback(
    ({ grid: nextGrid }: any) => {
      setGrid(nextGrid)
      pushLog('gridUpdate', `${nextGrid} view`)
    },
    [pushLog]
  )

  const handleEventClicked = useCallback(
    ({ event }: any) => {
      pushLog('eventClicked', `"${event?.name}" clicked`)
    },
    [pushLog]
  )

  // -------------------------------------------------------------------------
  // actions used by the customized components & control panel
  // -------------------------------------------------------------------------

  const deleteEvent = useCallback(
    (id: any) => {
      setEvents((prev) => prev.filter((e) => e.id !== id))
      pushLog('deleteEvent', `#${id} removed`)
    },
    [pushLog]
  )

  const confirmAdd = useCallback(
    (event: DemoEvent) => {
      setEvents((prev) => (prev.some((e) => e.id === event.id) ? prev : [...prev, event]))
      pushLog('eventAdd', `"${event.name}" confirmed from addModal`)
    },
    [pushLog]
  )

  const addRandomEvent = useCallback(() => {
    const ev = makeRandomEvent()
    setEvents((prev) => [...prev, ev])
    pushLog('eventAdd', `"${ev.name}" added from outside the calendar`)
  }, [pushLog])

  const resetDemo = useCallback(() => {
    setEvents(makeEvents())
    setInitialDate(startOfToday())
    pushLog('reset', 'events reset')
  }, [pushLog])

  const stepDate = useCallback(
    (direction: 1 | -1) => {
      setInitialDate((prev) => {
        const d = new Date(prev)
        if (grid === 'daily') d.setDate(d.getDate() + direction)
        else if (grid === 'weekly') d.setDate(d.getDate() + 7 * direction)
        else if (grid === 'list') {
          if (listMode === 'day') d.setDate(d.getDate() + direction)
          else if (listMode === 'week') d.setDate(d.getDate() + 7 * direction)
          else d.setMonth(d.getMonth() + direction)
        } else d.setMonth(d.getMonth() + direction)
        return d
      })
    },
    [grid, listMode]
  )

  // -------------------------------------------------------------------------
  // the components map : every section of the calendar customized from react.
  // sections left out fall back to the built in ui
  // -------------------------------------------------------------------------

  const components = useMemo<CalendarComponents>(
    () =>
      customize
        ? {
            // plain defaults - identical to the built in ui
            todayBtn: TodayButton,
            goBackDate: GoBackButton,
            goForwardDate: GoForwardButton,
            gridDropDown: GridDropdown,
            timeRange: TimeRangeLabel,
            groupContainer: GroupContainer,
            allDayEvent: AllDayEventCard,
            monthWeekDay: MonthWeekDayLabel,
            listDateHeader: ListDateHeader,

            // defaults extended by tiny demo wrappers
            headerDateSlot: DemoHeaderDate,
            dailyHeader: DemoDailyHeader,
            eventItem: DemoEventItem,
            monthEvent: DemoMonthEvent,
            monthDay: DemoMonthDay,
            listEvent: DemoListEvent,

            // modals wired with the demo's actions
            eventClick: (props) => <DemoEventClickModal {...props} onDelete={deleteEvent} />,
            addModal: (props) => <DemoAddEventModal {...props} onAdd={confirmAdd} />
          }
        : {},
    [customize, deleteEvent, confirmAdd]
  )

  return (
    <div className={`demo ${theme === 'dark' ? 'demo--dark' : ''}`}>
      <header className="demo-topbar">
        <h1>
          Full Event Calendar <span>react demo</span>
        </h1>
        <label className="demo-check demo-check--topbar">
          <input type="checkbox" checked={customize} onChange={(e) => setCustomize(e.target.checked)} />
          customize sections
        </label>
        <button
          className="demo-slot-btn demo-slot-btn--primary"
          onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        >
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
      </header>

      <div className="demo-body">
        <aside className="demo-controls">
          <section>
            <h2>Views</h2>
            <div className="demo-btn-row">
              {GRIDS.map((g) => (
                <button key={g} className={g === grid ? 'is-active' : ''} onClick={() => setGrid(g)}>
                  {g}
                </button>
              ))}
            </div>
            {grid === 'list' && (
              <div className="demo-btn-row">
                {LIST_MODES.map((m) => (
                  <button key={m} className={m === listMode ? 'is-active' : ''} onClick={() => setListMode(m)}>
                    {m}
                  </button>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2>Date</h2>
            <div className="demo-btn-row">
              <button onClick={() => stepDate(-1)}>‹ back</button>
              <button onClick={() => setInitialDate(startOfToday())}>today</button>
              <button onClick={() => stepDate(1)}>forward ›</button>
            </div>
          </section>

          <section>
            <h2>Imperative api</h2>
            <div className="demo-btn-row">
              <button onClick={() => apiRef.current?.prev()}>api.prev()</button>
              <button onClick={() => apiRef.current?.next()}>api.next()</button>
              <button onClick={() => apiRef.current?.goToday()}>api.goToday()</button>
            </div>
            <div className="demo-btn-row">
              <button onClick={() => apiRef.current?.changeGrid('weekly')}>api.changeGrid()</button>
              <button
                onClick={() => pushLog('api', `${apiRef.current?.getEvents().length} events via api.getEvents()`)}
              >
                api.getEvents()
              </button>
            </div>
          </section>

          <section>
            <h2>Locale</h2>
            <select value={locale} onChange={(e) => setLocale(e.target.value)}>
              {LOCALES.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </section>

          <section>
            <h2>Calendar type</h2>
            <select value={calendarType} onChange={(e) => setCalendarType(e.target.value)}>
              {CALENDARS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </section>

          <section>
            <h2>Time zone</h2>
            <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
              {TIME_ZONES.map((tz) => (
                <option key={tz}>{tz}</option>
              ))}
            </select>
          </section>

          <section>
            <h2>Behaviour</h2>
            <label className="demo-check">
              <input type="checkbox" checked={editable} onChange={(e) => setEditable(e.target.checked)} />
              editable (drag &amp; drop)
            </label>
            <label className="demo-check">
              <input type="checkbox" checked={autoUpdate} onChange={(e) => setAutoUpdate(e.target.checked)} />
              autoUpdateEventOnChange
            </label>
            <label className="demo-check">
              <input type="checkbox" checked={stopAddEvent} onChange={(e) => setStopAddEvent(e.target.checked)} />
              stopAddEvent (custom add modal)
            </label>
            <label className="demo-check">
              <input type="checkbox" checked={useGroups} onChange={(e) => setUseGroups(e.target.checked)} />
              groups (daily resources)
            </label>
          </section>

          <section>
            <h2>Sizing</h2>
            <label className="demo-slider">
              gridHeight <span>{gridHeight}px</span>
              <input
                type="range"
                min={480}
                max={2880}
                step={60}
                value={gridHeight}
                onChange={(e) => setGridHeight(+e.target.value)}
              />
            </label>
            <label className="demo-slider">
              containerHeight <span>{containerHeight}px</span>
              <input
                type="range"
                min={400}
                max={1100}
                step={50}
                value={containerHeight}
                onChange={(e) => setContainerHeight(+e.target.value)}
              />
            </label>
          </section>

          <section>
            <h2>External state</h2>
            <div className="demo-btn-row">
              <button onClick={addRandomEvent}>+ random event</button>
              <button onClick={resetDemo}>reset</button>
            </div>
            <div className="demo-hint">{events.length} events in state</div>
          </section>
        </aside>

        <main className="demo-calendar">
          <FullEventCalendar
            ref={apiRef}
            plugins={PLUGINS}
            events={events}
            initialDate={initialDate}
            grid={grid}
            theme={theme}
            locale={locale}
            calendar={calendarType}
            timeZone={timeZone}
            listMode={listMode}
            editable={editable}
            stopAddEvent={stopAddEvent}
            autoUpdateEventOnChange={autoUpdate}
            gridHeight={gridHeight}
            containerHeight={containerHeight}
            groups={useGroups ? demoGroups : []}
            components={components}
            eventUpdate={handleEventUpdate}
            eventAdd={handleEventAdd}
            addEventStoped={handleAddEventStoped}
            dateUpdate={handleDateUpdate}
            gridUpdate={handleGridUpdate}
            eventClicked={handleEventClicked}
          />
        </main>

        <aside className="demo-log">
          <h2>
            Calendar events <button onClick={() => setLog([])}>clear</button>
          </h2>
          <ul>
            {log.map((entry) => (
              <li key={entry.id}>
                <span className="demo-log__time">{entry.time}</span>
                <span className="demo-log__type">{entry.type}</span>
                <span className="demo-log__detail">{entry.detail}</span>
              </li>
            ))}
            {log.length === 0 && <li className="demo-log__empty">drag, click or add events to see them here</li>}
          </ul>
        </aside>
      </div>
    </div>
  )
}

export default App
