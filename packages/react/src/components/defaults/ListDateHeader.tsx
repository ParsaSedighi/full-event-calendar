import type { ListDateHeaderSlotProps } from '../../types'
import { cx } from '../../utils/classNames'

/** default date group header of the list grid.
 *  `className` is appended to both the day number and the week day text so
 *  tailwind utilities work */
export function ListDateHeader({ day, weekdayText, className }: ListDateHeaderSlotProps) {
  return (
    <>
      <div className={cx('fec-schedule-date', className)}>{day}</div>
      <div className={cx('fec-schedule-dates', className)}>{weekdayText}</div>
    </>
  )
}
