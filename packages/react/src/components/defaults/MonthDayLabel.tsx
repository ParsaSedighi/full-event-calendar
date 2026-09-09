import type { MonthDaySlotProps } from '../../types'
import { cx } from '../../utils/classNames'

/** default day cell content of the month grid ( date number + month name ).
 *  the cell wrapper ( click to open the daily grid , drag to create ) stays native.
 *  `className` is appended to both the day number and the month name so
 *  tailwind utilities work */
export function MonthDayLabel({ day, monthName, className }: MonthDaySlotProps) {
  return (
    <>
      <span className={className}>{day}</span>
      <div className={cx('fec-month-name', className)}>{monthName}</div>
    </>
  )
}
