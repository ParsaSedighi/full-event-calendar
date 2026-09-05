import type { DailyHeaderSlotProps } from '../../types'
import { formatDayNumber, formatWeekDay } from '../../utils/format'

/** default day column header of the daily / weekly grids.
 *  styled like the built in one and wired to `onDateChange` out of the box */
export function DailyHeader({ date, onDateChange, locale, calendar, timeZone, isToday }: DailyHeaderSlotProps) {
  return (
    <div className={`fec-daily-header ${isToday ? 'fec-daily-header-today' : ''}`}>
      <div className="fec-weekend-narrow">{formatWeekDay(date, locale, calendar, timeZone)}</div>
      <div onClick={() => onDateChange?.(date as Date)} className="fec-week-day">
        {formatDayNumber(date, locale, calendar, timeZone)}
      </div>
    </div>
  )
}
