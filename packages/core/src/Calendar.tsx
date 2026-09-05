import { CalendarImpl, CalendarSourceOptions } from './api/CalendarImpl'
import { CounterProvider } from './context-injector/context.jsx'
import { hydrate, render } from 'solid-js/web'
import { App } from './lib/App.jsx'
import { CalendarState } from './store/store.js'
import { FComponent } from '@full-event-calendar/shared-ts'

import './themes/clickDown.scss'
import './themes/fonts/vazirmatn.scss'
import { SlotProvider } from '@full-event-calendar/utils'

const CalendarRoot: FComponent<{ store: CalendarState; instance: Calendar; container: HTMLElement }> = (props) => {
  return (
    <CounterProvider store={props.store} instance={props.instance}>
      <SlotProvider
        slotRenderer={props.instance.renderStore}
        calendarContainer={props.container}
        avalibalSots={props.store.avalibalSots}
      >
        <App />
      </SlotProvider>
    </CounterProvider>
  )
}

export class Calendar extends CalendarImpl {
  private targetElement: HTMLElement
  private disposeRoot?: () => void
  // private EventListenrsStorage: EventCollection

  constructor(targetElement: HTMLElement, eventCalendarOptions: CalendarSourceOptions) {
    if (!targetElement) {
      throw Error('full-event-calendar --> a target element must be provided for the calendar to render.')
    }
    super(eventCalendarOptions)
    this.targetElement = targetElement
    // this.EventListenrsStorage = new EventCollection()
  }

  render() {
    this.disposeRoot = render(
      () => <CalendarRoot container={this.targetElement} store={this.storeManager} instance={this} />,
      this.targetElement
    )
    // function hydrate(fn: () => JSX.Element, node: MountableElement): () => void;
  }

  refresh() {
    hydrate(
      () => <CalendarRoot container={this.targetElement} store={this.storeManager} instance={this} />,
      this.targetElement
    )
  }

  // cleans up the solid root. called by the react connector on unmount
  destroy() {
    try {
      this.disposeRoot?.()
    } catch {
      // root already disposed
    }
    this.disposeRoot = undefined
  }
}

// hideTimeBar: false,
// scrollIntoCurrentTime: true,
// hasModal: false,
