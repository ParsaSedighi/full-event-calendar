import type { TodayButtonSlotProps } from '../../types'
import { calendarLocale } from '@full-event-calendar/locale'

/** default "today" button of the calendar header.
 *  looks exactly like the built in one - import it , wrap it , restyle it */
export function TodayButton(props: TodayButtonSlotProps) {
  return (
    <div className="fec-go-to-today" onClick={() => props.goToday?.()}>
      {calendarLocale(props.locale ?? 'en-US', 'today')}
    </div>
  )
}
