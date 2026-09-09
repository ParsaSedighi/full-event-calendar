import type { DemoEvent } from './data'
import {
  DailyHeader,
  EventClickModal,
  AddEventModal,
  EventItemCard,
  HeaderDate,
  ListEventRow,
  MonthDayLabel,
  MonthEventCard
} from 'roozaneh'
import type {
  DailyHeaderSlotProps,
  EventClickModalSlotProps,
  AddEventModalSlotProps,
  EventItemSlotProps,
  HeaderDateSlotProps,
  ListEventSlotProps,
  MonthDaySlotProps,
  MonthEventSlotProps
} from 'roozaneh'

// ---------------------------------------------------------------------------
// demo customizations. every component here EXTENDS one of the calendar's
// default react components - showing how easy each section is to customize :
// import the default , spread its props , add whatever you like
// ---------------------------------------------------------------------------

/** the calendar's own header date - wrapped with a gradient badge */
export function DemoHeaderDate(props: HeaderDateSlotProps) {
  return (
    <div className="demo-header-date">
      <HeaderDate {...props} />
    </div>
  )
}

/** the calendar's own day header - wrapped with a "today" pill highlight */
export function DemoDailyHeader(props: DailyHeaderSlotProps) {
  return <DailyHeader {...props} />
}

/** the calendar's own event card - extended with a status emoji */
export function DemoEventItem(props: EventItemSlotProps) {
  const emoji = pickEmoji(props.event?.name)
  return (
    <>
      {emoji && (
        <div style={{ position: 'absolute', inset: '2px auto 2px 4px', fontSize: 10 }} className="demo-event-emoji">
          {emoji}
        </div>
      )}
      <EventItemCard {...props} />
    </>
  )
}

/** the calendar's own month event card - extended with a emoji */
export function DemoMonthEvent(props: MonthEventSlotProps) {
  const emoji = pickEmoji(props.event?.name)
  return (
    <>
      {emoji && <span style={{ fontSize: 10, marginRight: 2 }}>{emoji}</span>}
      <MonthEventCard {...props} />
    </>
  )
}

/** the calendar's own month day cell - extended with a today badge */
export function DemoMonthDay(props: MonthDaySlotProps) {
  return (
    <div style={{ position: 'relative' }}>
      {props.isToday && <div className="demo-month-day-today" />}
      <MonthDayLabel {...props} />
    </div>
  )
}

/** the calendar's own list event row - extended with a fake join button */
export function DemoListEvent(props: ListEventSlotProps) {
  return <ListEventRow {...props} />
}

/** the calendar's event click modal - wired with a delete action */
export function DemoEventClickModal(props: EventClickModalSlotProps & { onDelete?: (id: any) => void }) {
  return <EventClickModal {...props} onDelete={props.onDelete} />
}

/** the calendar's add event modal - wired with the demo's confirm handler */
export function DemoAddEventModal(props: AddEventModalSlotProps & { onAdd?: (event: DemoEvent) => void }) {
  return <AddEventModal {...props} onAdd={props.onAdd} />
}

// ---------------------------------------------------------------------------

function pickEmoji(name?: string): string | null {
  const n = (name || '').toLowerCase()
  if (n.includes('lunch') || n.includes('brunch') || n.includes('coffee')) return '🍽'
  if (n.includes('gym')) return '💪'
  if (n.includes('standup') || n.includes('sync') || n.includes('call')) return '📞'
  if (n.includes('party') || n.includes('hackathon')) return '🎉'
  if (n.includes('vacation') || n.includes('offsite')) return '🏝'
  if (n.includes('review') || n.includes('retro')) return '🔍'
  if (n.includes('workshop') || n.includes('interview') || n.includes('conference')) return '🎤'
  return null
}
