import { useState } from 'react'
import type { DemoEvent } from './data'

// ---------------------------------------------------------------------------
// All calendar slots. Each slot replaces a piece of the calendar's built in
// ui. The data the calendar passes to every slot is spread as props
// (e.g. <HeaderDateSlot date={...} />).
// ---------------------------------------------------------------------------

type SlotProps = Record<string, any>

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function fmt(
  date: Date | string | number | undefined,
  locale: string,
  calendar: string,
  opts: Intl.DateTimeFormatOptions,
  timeZone?: string
) {
  const d = date instanceof Date ? date : new Date(date as any)
  if (!d || isNaN(d.getTime())) return ''
  try {
    return new Intl.DateTimeFormat(locale, { calendar, timeZone, ...opts }).format(d)
  } catch {
    return new Intl.DateTimeFormat('en-US', opts).format(d)
  }
}

/** replaces the built in "today" button of the header */
export function TodayBtnSlot(_: SlotProps) {
  return <button className="demo-slot-btn demo-slot-btn--primary">Today</button>
}

/** replaces the built in go-back button of the header */
export function GoBackDateSlot(_: SlotProps) {
  return (
    <button className="demo-slot-btn" aria-label="previous">
      ‹
    </button>
  )
}

/** replaces the built in go-forward button of the header */
export function GoForwardDateSlot(_: SlotProps) {
  return (
    <button className="demo-slot-btn" aria-label="next">
      ›
    </button>
  )
}

/** replaces the big date in the header.
 *  receives { date } — a string already formatted by the calendar
 *  according to locale / calendar type / time zone / current grid */
export function HeaderDateSlot({ date }: SlotProps) {
  return <div className="demo-header-date">{date ?? ''}</div>
}

/** replaces the grid picker dropdown of the header. receives { grid } */
export function GridDropDownSlot({ grid, onSelectGrid }: SlotProps) {
  const options = ['daily', 'weekly', 'month', 'list']
  return (
    <div className="demo-grid-picker">
      {options.map((option) => (
        <button
          key={option}
          className={`demo-grid-picker__item ${grid === option ? 'is-active' : ''}`}
          onClick={() => onSelectGrid?.(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

/** replaces the day header of the daily grid. receives { date, ondataChange } */
export function DailyHeaderSlot({ date, ondataChange, locale, calendar, timeZone }: SlotProps) {
  const d = new Date(date)
  const isToday = sameDay(d, new Date())
  return (
    <div className={`demo-daily-header ${isToday ? 'is-today' : ''}`} onClick={() => ondataChange?.(d)}>
      <span className="demo-daily-header__weekday">{fmt(d, locale, calendar, { weekday: 'short' }, timeZone)}</span>
      <span className="demo-daily-header__day">{fmt(d, locale, calendar, { day: 'numeric' }, timeZone)}</span>
    </div>
  )
}

/** replaces a time label of the daily/weekly time column.
 *  receives { time } — a Date (hour is what matters) or '' for the top row */
export function TimeRangeSlot({ time, locale }: SlotProps) {
  const label = time ? fmt(time, locale, 'gregory', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }) : ''
  return <div className="demo-time-range">{label}</div>
}

/** replaces a group (resource) header of the daily grid. receives { group } */
export function GroupContainerSlot({ group }: SlotProps) {
  const name: string = group?.name ?? ''
  return (
    <div className="demo-group-header">
      <span className="demo-group-header__avatar">{name.charAt(0)}</span>
      <span className="demo-group-header__name">{name}</span>
    </div>
  )
}

/** modal shown when an event is clicked. receives { eventData, saveModal } */
export function EventClickSlot({ eventData, saveModal, onDelete }: SlotProps) {
  const ev: DemoEvent | undefined = eventData?.sourceEvent
  return (
    <div className="demo-modal">
      <div className="demo-modal__title">{ev?.name ?? eventData?.name ?? 'Event'}</div>
      {ev && (
        <div className="demo-modal__row">
          <span>start</span>
          <span>{ev.start.toLocaleString()}</span>
        </div>
      )}
      {ev && (
        <div className="demo-modal__row">
          <span>end</span>
          <span>{ev.end.toLocaleString()}</span>
        </div>
      )}
      <div className="demo-modal__row">
        <span>id</span>
        <span>{String(eventData?.id)}</span>
      </div>
      <div className="demo-modal__actions">
        <button className="demo-slot-btn demo-slot-btn--danger" onClick={() => onDelete?.(eventData?.id)}>
          Delete
        </button>
        <button className="demo-slot-btn" onClick={() => saveModal?.()}>
          Close
        </button>
      </div>
    </div>
  )
}

/** modal shown when an event is drag created while `stopAddEvent` is true.
 *  receives { eventData, saveModal } */
export function AddModalSlot({ eventData, saveModal, onConfirm }: SlotProps) {
  const [name, setName] = useState('')
  const src: Partial<DemoEvent> | undefined = eventData?.sourceEvent
  function confirm() {
    onConfirm?.({ ...src, name: name || src?.name || 'Untitled event' })
    saveModal?.()
  }
  return (
    <div className="demo-modal">
      <div className="demo-modal__title">New event</div>
      <div className="demo-modal__row">
        <span>name</span>
        <input value={name} placeholder={src?.name ?? 'Untitled event'} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="demo-modal__row">
        <span>start</span>
        <span>{src?.start?.toLocaleString()}</span>
      </div>
      <div className="demo-modal__row">
        <span>end</span>
        <span>{src?.end?.toLocaleString()}</span>
      </div>
      <div className="demo-modal__actions">
        <button className="demo-slot-btn demo-slot-btn--primary" onClick={confirm}>
          Add event
        </button>
        <button className="demo-slot-btn" onClick={() => saveModal?.()}>
          Discard
        </button>
      </div>
    </div>
  )
}
