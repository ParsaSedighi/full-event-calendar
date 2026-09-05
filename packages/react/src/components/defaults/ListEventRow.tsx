import type { ListEventSlotProps } from '../../types'

/** default event row content of the list grid.
 *  the row wrapper ( click ) stays native */
export function ListEventRow({ event, timeText }: ListEventSlotProps) {
  return (
    <>
      <div className="fec-event-date-list">
        <div className="fec-event-dot" style={{ backgroundColor: event?.color }}></div>
        {timeText}
      </div>
      <div>{event?.name}</div>
    </>
  )
}
