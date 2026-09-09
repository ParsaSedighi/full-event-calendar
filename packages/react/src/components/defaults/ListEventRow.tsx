import type { ListEventSlotProps } from '../../types'
import { cx } from '../../utils/classNames'

/** default event row content of the list grid.
 *  the row wrapper ( click ) stays native.
 *  `className` is appended to both content elements so tailwind utilities work */
export function ListEventRow({ event, timeText, className }: ListEventSlotProps) {
  return (
    <>
      <div className={cx('fec-event-date-list', className)}>
        <div className="fec-event-dot" style={{ backgroundColor: event?.color }}></div>
        {timeText}
      </div>
      <div className={className}>{event?.name}</div>
    </>
  )
}
