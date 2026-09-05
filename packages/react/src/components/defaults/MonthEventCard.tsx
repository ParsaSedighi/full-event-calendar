import type { MonthEventSlotProps } from '../../types'

/** default content of an event card of the month grid / weekly all day row.
 *  the card wrapper ( position , color , click & drag ) stays native */
export function MonthEventCard({ event, timeText, isAllDay }: MonthEventSlotProps) {
  return (
    <>
      <div className="fec-event-time-month">{isAllDay ? '' : `${timeText ?? ''} `}</div>
      <div className="fec-event-name-month">{isAllDay ? event?.name : `(${event?.name})`}</div>
    </>
  )
}
