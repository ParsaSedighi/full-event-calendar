import { FComponent } from '@roozaneh/shared-ts'
import { For, Show } from 'solid-js'
import { MonthDateObject } from '../../MonthGrid'
import { formatNumber, getMonthName, isDateToday, useSlot } from '@roozaneh/utils'
import './MonthDateContainer.scss'

interface MonthDateContainerProps {
  locale: string
  monthRowIndex: number // props.monthRowIndex
  monthRowDates: MonthDateObject[] // monthRowArr
  calendar: string // props
  dragClick: any //
  monthDateMouseDown: any //
  onMouseEnter: any //
}

// one day cell of the month grid. the `monthDay` slot lets React fully
// customize what is rendered inside the day cell (date number , month name...)
// while the cell itself keeps its click ( go to daily grid ) and drag-to-create
// behaviour
const MonthDay: FComponent<{
  date: MonthDateObject
  locale: string
  calendar: string
  dragClick: any
  isDateInsideMonth: boolean
  monthName: string
}> = (props) => {
  function stopDefault(e: MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
  }

  let daySlot: any = {
    el: null
  }
  const slotData = () => {
    return {
      date: props.date.date,
      day: props.date.day,
      monthName: props.monthName,
      isToday: isDateToday(props.date.date),
      isInsideMonth: props.isDateInsideMonth,
      locale: props.locale,
      calendar: props.calendar
    }
  }
  const { isSlotAvalibale } = useSlot(daySlot, slotData, 'monthDay', () => props.date.date)

  return (
    <div onmousedown={stopDefault} onclick={(e) => props.dragClick(e, props.date.date)} ref={daySlot.el}>
      <Show when={!isSlotAvalibale}>
        <span>{formatNumber(props.locale, props.date.day as any)}</span>
        <div class="fec-month-name">{props.monthName}</div>
      </Show>
    </div>
  )
}

export const MonthDateContainer: FComponent<MonthDateContainerProps> = (props) => {
  function mouseDownSome(date: Date, e: MouseEvent) {
    let hasMouseMoved = false
    function handelMouseMove() {
      if (!hasMouseMoved) {
        props.monthDateMouseDown(date, e)
        hasMouseMoved = true
      }
      document.removeEventListener('mousemove', handelMouseMove)
    }
    function handelMouseUp() {
      document.removeEventListener('mouseup', handelMouseUp)
      document.removeEventListener('mousemove', handelMouseMove)
    }
    document.addEventListener('mousemove', handelMouseMove)
    document.addEventListener('mouseup', handelMouseUp)
  }
  // props.monthDateMouseDown
  return (
    <>
      <For each={props.monthRowDates}>
        {(date, i) => (
          <div
            onmousedown={[mouseDownSome, date.date]}
            class="fec-month-container"
            onmousemove={() => props.onMouseEnter(date.date)}
          >
            <div
              class={`fec-month-day-wrapper ${isDateInsideMonth(date, i(), props.monthRowIndex, props.monthRowDates)}`}
            >
              <MonthDay
                date={date}
                locale={props.locale}
                calendar={props.calendar}
                dragClick={props.dragClick}
                isDateInsideMonth={date.isDateInsideMonth}
                monthName={getMonthName(props.calendar, date.date, props.locale)}
              />
            </div>
          </div>
        )}
      </For>
    </>
  )
}

function isDateInsideMonth(
  date: MonthDateObject,
  index: number,
  monthRowIndex: number,
  monthRowArr: MonthDateObject[]
) {
  if (date.isDateInsideMonth) {
    if (monthRowIndex === 0) {
      return date.month != monthRowArr[index + 1]?.month ? 'fec-month-day-out' : 'fec-month-day-out-no-name'
    } else if (date.isDateInsideMonth) {
      return date.month != monthRowArr[index - 1]?.month ? 'fec-month-day-out' : 'fec-month-day-out-no-name'
    }
  }
  return ''
}
