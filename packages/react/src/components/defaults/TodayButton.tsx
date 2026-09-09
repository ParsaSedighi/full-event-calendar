import type { TodayButtonSlotProps } from '../../types'
import { calendarLocale } from '@roozaneh/locale'
import { cx } from '../../utils/classNames'

/** default "today" button of the calendar header.
 *  looks exactly like the built in one - import it , wrap it , restyle it
 *  ( `className` is appended to the button so tailwind utilities work ) */
export function TodayButton({ goToday, locale, className }: TodayButtonSlotProps) {
  return (
    <div className={cx('fec-go-to-today', className)} onClick={() => goToday?.()}>
      {calendarLocale(locale ?? 'en-US', 'today')}
    </div>
  )
}
