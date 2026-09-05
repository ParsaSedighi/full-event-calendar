import type { EventItemSlotProps } from '../../types'

/** default content of a timed event card of the daily / weekly grids.
 *  the card wrapper ( position , color , drag & resize ) stays native -
 *  this component renders the name + time range inside it */
export function EventItemCard({ event, timeText }: EventItemSlotProps) {
  return (
    <>
      <div className="fec-item-trunctae fec-event-name">{event?.name}</div>
      <div>
        <span className="event-time-detals">{timeText}</span>
      </div>
    </>
  )
}
