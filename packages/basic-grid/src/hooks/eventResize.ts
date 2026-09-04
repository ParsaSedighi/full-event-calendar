import { EventClass, SourceEvent } from '@full-event-calendar/shared-ts'
import { CalendarDragger, drageModes } from './newDragging'
import { createSignal } from 'solid-js'
import { useCalenderContainerState } from '@full-event-calendar/utils'

export function useResize(
  drageMode: drageModes,
  resizeEndCalllBack: (p: SourceEvent) => void,
  editable: () => boolean,
  onMouseMove?: () => void
) {
  const [draggedData, setDraggedData] = createSignal<any>()
  const container = useCalenderContainerState()

  function onmousedownH(item: EventClass, e: MouseEvent) {
    if (!editable()) return

    const calendarDragger = new CalendarDragger(drageMode, container!)

    e.stopPropagation()
    calendarDragger.dragger.dragStart(e, item)
    window.addEventListener('mousemove', mousemove)
    window.addEventListener('mouseup', mouseup)

    function mousemove(e: MouseEvent) {
      calendarDragger.dragger.mouseMove(e)
      if (onMouseMove) onMouseMove()
      setDraggedData(calendarDragger.dragger.draggingController)
    }

    function mouseup(e: MouseEvent) {
      setDraggedData(null)
      calendarDragger.dragger.dragEnd(e)
      const controller = calendarDragger.dragger.draggingController
      if (controller) {
        const sourceE = { ...controller.item.sourceEvent } as SourceEvent
        sourceE.end = controller.eventSourceEnd
        sourceE.start = controller.eventSourceStart
        resizeEndCalllBack(sourceE)
      }

      window.removeEventListener('mousemove', mousemove)
      window.removeEventListener('mouseup', mouseup)
    }
  }

  return { onmousedownH, draggedData }
}
