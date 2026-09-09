import type { MonthEventSlotProps } from '../../types'
import { cx } from '../../utils/classNames'

/** default content of an event card of the month grid / weekly all day row.
 *  the card wrapper ( position , color , click & drag ) stays native.
 *  `className` is appended to both content elements so tailwind utilities work */
export function MonthEventCard({ event, timeText, isAllDay, className }: MonthEventSlotProps) {
  return (
    <>
      <div className={cx('fec-event-time-month', className)}>{isAllDay ? '' : `${timeText ?? ''} `}</div>
      <div className={cx('fec-event-name-month', className)}>{isAllDay ? event?.name : `(${event?.name})`}</div>
    </>
  )
}
