import type { ListDateHeaderSlotProps } from '../../types'

/** default date group header of the list grid */
export function ListDateHeader({ day, weekdayText }: ListDateHeaderSlotProps) {
  return (
    <>
      <div className="fec-schedule-date">{day}</div>
      <div className="fec-schedule-dates">{weekdayText}</div>
    </>
  )
}
