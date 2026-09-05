import type { MonthDaySlotProps } from '../../types'

/** default day cell content of the month grid ( date number + month name ).
 *  the cell wrapper ( click to open the daily grid , drag to create ) stays native */
export function MonthDayLabel({ day, monthName }: MonthDaySlotProps) {
  return (
    <>
      <span>{day}</span>
      <div className="fec-month-name">{monthName}</div>
    </>
  )
}
