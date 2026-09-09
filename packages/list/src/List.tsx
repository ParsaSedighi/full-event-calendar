//types
import { EventClass, FComponent } from '@roozaneh/shared-ts'
//solid.js
import { For, Show, createMemo, mergeProps } from 'solid-js'
//utils
import { calendarLocale } from '@roozaneh/locale'
import { formatDD, formatDM, formatRange, getFirstDayOfWeek, useSlot, useSlotModal } from '@roozaneh/utils'

import { GroupEventMap } from './lib/EventListCollection'
// Styles
import './List.scss'
export interface ListGridProps {
  events?: EventClass[]
  initialDate?: Date
  onEventUpdate?: (event: any) => void
  onDateChange?: (d: Date) => void
  onGridChange?: (d: any) => void
  onEventClick: (event: EventClass) => void
  locale: string
  calendar?: string
  timeZone?: string
  gridHeight?: number
  listMode: 'day' | 'week' | 'month'
}

const defaultProps = {
  events: [],
  initialDate: new Date(),
  onEventUpdate: () => {},
  onDateChange: () => {},
  onGridChange: () => {},
  onEventClick: () => {},
  locale: 'en-US',
  calendar: 'gregory',
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  gridHeight: 65 * 24,
  listMode: 'week'
}

// one event row of the list. the `listEvent` slot lets React customize the
// content of every event row while the row keeps its click behaviour
const ListEventRow: FComponent<{
  item: EventClass
  locale: string
  calendar: string
  onClick: (event: EventClass, e: MouseEvent) => void
}> = (props) => {
  let rowSlot: any = {
    el: null
  }
  const slotData = () => {
    return {
      event: props.item,
      locale: props.locale,
      calendar: props.calendar,
      timeText: props.item.isAllDay()
        ? calendarLocale(props.locale, 'all_day')
        : formatRange(props.item.start, props.item.end, props.locale)
    }
  }
  const { isSlotAvalibale } = useSlot(rowSlot, slotData, 'listEvent', () => props.item)

  return (
    <div onclick={[props.onClick, props.item]} class="fec-fec-event-list-item-des" ref={rowSlot.el}>
      <Show when={!isSlotAvalibale}>
        <div class="fec-event-date-list">
          <div class="fec-event-dot" style={`background-color:${props.item.color}`}></div>
          {props.item.isAllDay()
            ? calendarLocale(props.locale, 'all_day')
            : formatRange(props.item.start, props.item.end, props.locale)}
        </div>
        <div class="fec-event-name-list">{props.item.name}</div>
      </Show>
    </div>
  )
}

// the date header of one day group of the list. the `listDateHeader` slot
// lets React customize every date header of the list view
const ListDateHeaderRow: FComponent<{
  date: string
  events: EventClass[]
  locale: string
  calendar: string
}> = (props) => {
  let dateSlot: any = {
    el: null
  }
  const slotData = () => {
    return {
      date: new Date(props.date),
      events: props.events,
      locale: props.locale,
      calendar: props.calendar,
      day: formatDD(new Date(props.date), props.calendar, props.locale),
      weekdayText: formatDM(new Date(props.date), props.calendar, props.locale)
    }
  }
  const { isSlotAvalibale } = useSlot(dateSlot, slotData, 'listDateHeader', () => props.date)

  return (
    <div class="fec-event-list-item-time" ref={dateSlot.el}>
      <Show when={!isSlotAvalibale}>
        <div class="fec-schedule-date">{formatDD(new Date(props.date), props.calendar, props.locale)}</div>
        <div class="fec-schedule-dates">{formatDM(new Date(props.date), props.calendar, props.locale)}</div>
      </Show>
    </div>
  )
}

export const List: FComponent<ListGridProps> = (props) => {
  const mergedProps = mergeProps(defaultProps, props)
  const generateGroup = createMemo(() => {
    // week grouping starts on the locale first day of week (fa-IR weeks start on Saturday)
    let groupEventMap = new GroupEventMap(
      mergedProps.listMode,
      mergedProps.initialDate,
      mergedProps.calendar,
      getFirstDayOfWeek(mergedProps.locale)
    )
    return groupEventMap.group(mergedProps.events)
  })

  const {
    modalElementNode: addModalElement,
    setSlotModalData: setEvModalElement,
    openSlotModalOnElement: openEvSlotModalOnElement
  } = useSlotModal('eventClick')

  function isMlistEmpty() {
    let len = 0
    Object.keys(generateGroup()).forEach((key) => {
      len += generateGroup()[key].length
    })
    return len === 0
  }

  function itemClick(event: EventClass, e: MouseEvent) {
    setEvModalElement(event)
    props.onEventClick(event)
    openEvSlotModalOnElement(e.target)
  }

  return (
    <>
      {addModalElement}
      <div class="fec-event-list">
        <div class="fec-scroll-wrapper-list fec-custome-scroll-bar">
          <Show when={isMlistEmpty()}>
            <div class="fec-no-events-text">{calendarLocale(props.locale, 'no_events')}</div>
          </Show>

          <For each={Object.keys(generateGroup())}>
            {(item) => {
              return generateGroup()[item].length === 0 ? (
                <></>
              ) : (
                <div class="fec-event-list-item">
                  <ListDateHeaderRow
                    date={item}
                    events={generateGroup()[item]}
                    locale={mergedProps.locale}
                    calendar={mergedProps.calendar}
                  />
                  <div class="fec-schedule-event-wrapper">
                    <For each={generateGroup()[item]}>
                      {(item) => (
                        <ListEventRow
                          item={item}
                          locale={mergedProps.locale}
                          calendar={mergedProps.calendar}
                          onClick={itemClick}
                        />
                      )}
                    </For>
                  </div>
                </div>
              )
            }}
          </For>
        </div>
      </div>
    </>
  )
}
