import type { EventItemSlotProps } from '../../types'
import { cx } from '../../utils/classNames'

/** default content of a timed event card of the daily / weekly grids.
 *  the card wrapper ( position , color , drag & resize ) stays native -
 *  this component renders the name + time range inside it.
 *  `className` is appended to both content elements so tailwind utilities work */
export function EventItemCard({ event, timeText, className }: EventItemSlotProps) {
  return (
    <>
      <div className={cx('fec-item-trunctae', 'fec-event-name', className)}>{event?.name}</div>
      <div className={className}>
        <span className="event-time-detals">{timeText}</span>
      </div>
    </>
  )
}
