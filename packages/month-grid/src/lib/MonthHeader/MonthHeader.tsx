import { FComponent } from '@roozaneh/shared-ts'
import { For, Show } from 'solid-js'
import { MonthDateObject } from '../MonthGrid'
import { formatWeekDays, useSlot } from '@roozaneh/utils'
import './MonthHeader.scss'

interface ModalHeaderProps {
  headerData: MonthDateObject[]
  timeZone: string
  calendar: string
  locale: string
}

// one week day column of the month header. the `monthWeekDay` slot lets React
// customize every week day label of the month grid
const MonthWeekDay: FComponent<{ date: Date; label: string; locale: string }> = (props) => {
  let daySlot: any = {
    el: null
  }
  const slotData = () => {
    return {
      date: props.date,
      label: props.label,
      locale: props.locale
    }
  }
  const { isSlotAvalibale } = useSlot(daySlot, slotData, 'monthWeekDay', () => props.label)

  return (
    <div ref={daySlot.el}>
      <Show when={!isSlotAvalibale}>{props.label}</Show>
    </div>
  )
}

export const MonthHeader: FComponent<ModalHeaderProps> = (props) => {
  function formateWeekDate(date: Date) {
    return formatWeekDays(date, props.calendar, props.timeZone, props.locale)
  }

  // the first 7 dates of the month grid cover every week day ( the grid
  // itself is built starting on the locale first day of week )
  const weekDays = props.headerData.slice(0, 7)

  return (
    <div class="fec-month-header">
      <For each={weekDays}>
        {(date) => <MonthWeekDay date={date.date} label={formateWeekDate(date.date)} locale={props.locale} />}
      </For>
    </div>
  )
}
