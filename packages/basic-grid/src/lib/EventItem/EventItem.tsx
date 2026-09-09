import { EventClass, FComponent } from '@roozaneh/shared-ts'
import { detectLeftButton, formatRange, getDateTimeRange, getEventTimeRange, useSlot } from '@roozaneh/utils'
import './EventItem.scss'
import { Show, createMemo } from 'solid-js'
interface EventItem {
  onDragStart: (event: EventClass, e: MouseEvent, D: boolean) => void
  onMouseDown: any
  event: EventClass
  gridDate: Date
  width: string
  locale: string
  top0?: boolean
  oneHoureInPixel: number
}

export const EventItem: FComponent<EventItem> = (props) => {
  const doesEventStartOnGridDate = () => props.event.doesEventStartOn(props.gridDate)
  function getPosition() {
    return doesEventStartOnGridDate() && !props.top0 ? props.event.calculatePositionTop() : 'top:0'
  }
  const getHeight = createMemo(() => {
    return props.event.doesEventEndOn(props.gridDate)
      ? props.event.calculateHeight(!doesEventStartOnGridDate())
      : `height:${2400 - props.event.getEventTopPositionIng()}%`
  })

  function getBackGroundColor() {
    return `;background-color:${props.event.color}`
  }
  function getBorders() {
    const endCon = props.event.doesEventEndOn(props.gridDate)
    const startCon = doesEventStartOnGridDate()

    if (!startCon) {
      return 'border-top-left-radius: 0px;border-top-right-radius:0px'
    } else if (!endCon) {
      return 'border-bottom-left-radius: 0px;border-bottom-right-radius:0px'
    }
    return ''
  }

  function isLowHeight() {
    const heightInPercentage = props.event.calculateHeightPersentage(!doesEventStartOnGridDate())
    const heightInPixel = (props.oneHoureInPixel * heightInPercentage) / 100

    return heightInPixel < 40
  }

  // `eventItem` slot : the content of a timed event card can be fully
  // customized from React while the card itself keeps its position,
  // background color, drag and resize behaviour
  let contentSlot: any = {
    el: null
  }
  const slotData = () => {
    return {
      event: props.event,
      locale: props.locale,
      timeText: getDateTimeRange(props.event.start, props.event.end, props.locale),
      isAllDay: props.event.isAllDay()
    }
  }
  const { isSlotAvalibale } = useSlot(contentSlot, slotData, 'eventItem', () => props.event)

  return (
    <div
      onMouseDown={(e: MouseEvent) => {
        if (detectLeftButton(e)) props.onDragStart(props.event, e, !doesEventStartOnGridDate())
      }}
      id={'event-' + props.event.id}
      class={`fec-event ${isLowHeight() ? 'fec-one-line-event ' : ''} `}
      data-test-event-id={props.event.id}
      style={`${getPosition()} ;${getHeight()} ;${props.width} ;${getBackGroundColor()};${getBorders()}`}
    >
      <div ref={contentSlot.el} style="position:sticky;top:0px;bottom:30px" class="tooltip-multiline fec-event-info">
        <Show when={!isSlotAvalibale}>
          <div class="fec-item-trunctae fec-event-name">{props.event.name}</div>
          <div>
            <span class="event-time-detals" id={'event-end-' + props.event.id}>
              {getDateTimeRange(props.event.start, props.event.end, props.locale)}
            </span>
          </div>
        </Show>
      </div>
      <div onmousedown={[props.onMouseDown, props.event]} class="fec-resizer"></div>
    </div>
  )
}
