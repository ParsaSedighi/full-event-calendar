import { onMount } from 'solid-js'
import { useGridSliderAnimation } from './hooks/GridSliderAnimation'
import { FComponent } from '@roozaneh/shared-ts'
import './SliderWrapper.scss'

export const SliderWrapper: FComponent = (props) => {
  let containerRef: any
  let calendarContainerRef: any

  onMount(() => {
    useGridSliderAnimation({
      containerRef,
      calendarContainerRef
    })
  })
  return (
    <div ref={calendarContainerRef} style="position:relative;flex: 1;" id="calendar-container">
      <div ref={containerRef} class="fec-not-cloned fec-grid-wrapper" id="roozaneh-wrapper">
        {props.children}
      </div>
    </div>
  )
}
