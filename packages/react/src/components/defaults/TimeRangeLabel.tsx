import type { TimeRangeSlotProps } from '../../types'
import { formatShortTime } from '../../utils/format'
import { cx } from '../../utils/classNames'

/** default hour label of the daily / weekly time column.
 *  renders '' for the top row like the built in one.
 *  `className` is appended to both the label and the hairline so tailwind
 *  utilities work */
export function TimeRangeLabel({ time, locale, className }: TimeRangeSlotProps) {
  const label = time ? formatShortTime(time, locale) : ''
  return (
    <>
      <div className={cx('fec-time-range-time', className)}>{label}</div>
      <div className={cx('fec-time-range-hairline', className)}></div>
    </>
  )
}
