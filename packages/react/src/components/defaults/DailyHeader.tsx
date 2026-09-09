import type { DailyHeaderSlotProps } from '../../types'
import { formatDayNumber, formatWeekDay } from '../../utils/format'
import { cx } from '../../utils/classNames'

/** default day column header of the daily / weekly grids.
 *  styled like the built in one and wired to `onDateChange` out of the box.
 *  `className` is appended to the header so tailwind utilities work */
export function DailyHeader({
  date,
  onDateChange,
  locale,
  calendar,
  timeZone,
  isToday,
  className
}: DailyHeaderSlotProps) {
  return (
    <div className={cx('fec-daily-header', isToday && 'fec-daily-header-today', className)}>
      <div className="fec-weekend-narrow">{formatWeekDay(date, locale, calendar, timeZone)}</div>
      <div onClick={() => onDateChange?.(date as Date)} className="fec-week-day">
        {formatDayNumber(date, locale, calendar, timeZone)}
      </div>
    </div>
  )
}
