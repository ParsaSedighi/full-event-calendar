# Roozaneh

## About
Roozaneh (Persian: روزانه) is a fork of [full-event-calendar](https://github.com/persianpack/full-event-calendar) by persianpack, continued as a simple, lightweight, and fast event calendar for React. It supports 18 calendars and 100 locales, powered by [Solid.js](https://solidjs.com/) and [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).

Inspired by [FullCalendar](https://fullcalendar.io/) and [ClickUp](https://clickup.com/).

## Features
- ✔️ Built with typescript and [**_solid.js_**](https://www.solidjs.com/).
- ✔️ Support for React.js.
- ✔️ Mulitple Calendar type support like `chinese` , `gregory` , `persian` and ...
- ✔️ Timezone converstion suppourt.
- ✔️ Customization support for every component slots , CSS and SASS.
- ✔️ Reduce your project's bundle size by using FullEventCalendar's modular plugins.
- ✔️ 100 locales support with intL.
- ✔️ Fast and light weight(40kb - 80kb).
- ✔️ Capable with Vanilla js.
- ✔️ Dark and White mode support.
- ✔️ Responsive design.

# Table of Contents

- [**_Installation_**](#installation)
- [**_Basic Usage_**](#basic-usage)
- [**_Api_**](#Api)
  - [**_Props_**](#props)
  - [**_Events_**](#events)
  - [**_Customization ( components )_**](#customization)
    - [**_Components map_**](#components-map)
    - [**_Default components_**](#default-components)
    - [**_Slot props_**](#slot-props)
    - [**_Direct slot props_**](#direct-slot-props)
  - [**_Imperative api_**](#imperative-api)
- [**_Styling_**](#styling)
  - [**_Sass varibales_**](#sass-varibles)
  - [**_Css_**](#css-class)
- [**_Author_**](#author)
- [**_License_**](#license)

## Installation

```
npm i roozaneh
```
or
```
yarn add roozaneh
```
NOTE : <ins> atleast 1 plugin must be provided </ins> available grid plugins ( all re-exported from `roozaneh` , or importable from their own packages ) :
  - `@roozaneh/daily-grid` - daily view
  - `@roozaneh/weekly-grid` - weekly view
  - `@roozaneh/month-grid` - month view
  - `@roozaneh/list` - list view
 
## Basic Usage
react js :
```jsx
 
import { useEffect, useState } from 'react'
import { FullEventCalendar, DailyGridPlugin } from 'roozaneh'
// plugins can also be imported from their own packages :
// import { DailyGridPlugin } from '@roozaneh/daily-grid'
// import { MonthGridPlugin } from '@roozaneh/month-grid'
// import { WeeklyGridPlugin } from '@roozaneh/weekly-grid'
// import { ListPlugin } from '@roozaneh/list'
import '@roozaneh/core/dist/main.css' // this must be imported

const eventsList = [
  {
    name: 'some name',
    start: new Date(' Aug 10 2023 08:00:0'),
    end: new Date(' Aug 10 2023 10:00:00'),
    id: 16123,
    color: '#BF51F9',
    // groups: [2]
  },
  {
    name: 'some name',
    start: new Date(' Aug 10 2023 10:00:0'),
    color: '#31B5F7',
    end: new Date(' Aug 10 2023 11:00:00'),
    id: 18123,
    // groups: [1]
  },
]
 
 
function App() {
  const [initialDate, setInitialDate] = useState(new Date('Thu Aug 10 2023 15:00:0'))
  const [events, setEvents] = useState(eventsList)

  function onEventUpdate({prev,next,id}) {
    console.log('updated event : ' ,prev)
    console.log('to event : ' ,next)
    console.log('with id : ' ,id)
    // eventsList.value.push(data.next.sourceEvent)
  }

  return (
      <FullEventCalendar
         plugins={[DailyGridPlugin]}
         events={events} 
         initialDate={initialDate}
         eventUpdate={onEventUpdate}

         {/* customize any section ( see the Customization section ) */}
         components={{
           todayBtn: TodayButton,
           eventItem: (props) => <MyEventCard {...props} />,
           eventClick: (props) => <EventClickModal {...props} onDelete={deleteEvent} />
         }}
        ></FullEventCalendar>
  )
  
}
 
```

## Api

## options

### `events`
 - Type : Array
 - Default : []
 An array of source events to populate the calendar that fallows the below structure
 ```ts
 interface SourceEvent {
   start: Date
   end: Date
   name: string
   id: any
   color?: string
   groups?: number[] | string[]
 }
 ```
 the default color is #31b5f7 for light and #3499F5 for dark.
 the group resources id's which the event is part of. for this to work the - [**_Groups_**](#groups) options has to be provided.
### `plugins` 
 - Type : Array
 - Required
  An array of grid plugins for the event calendar different grid views<ins> atleast 1 plugin must be provided </ins> available grid plugins:
  - `@roozaneh/daily-grid` - daily view
  - `@roozaneh/weekly-grid` - weekly view
  - `@roozaneh/month-grid` - month view
  - `@roozaneh/list` - list view

  ```jsx
  import { DailyGridPlugin } from '@roozaneh/daily-grid'
  import { WeeklyGridPlugin } from '@roozaneh/weekly-grid'
  import { MonthGridPlugin } from '@roozaneh/month-grid'
  import { ListPlugin } from '@roozaneh/list'
 
  function App() {

    return(
      <FullEventCalendar 
         ...
        plugins={[DailyGridPlugin, WeeklyGridPlugin, MonthGridPlugin, ListPlugin]}
          ...
       />
      )
   }
  ```
   <!-- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getCalendars#supported_calendar_types -->
  <!-- [**_Groups_**](#css-class) -->

### `calendar`
  - Type : String
  - Default : gregory

   The type of calendar to be used . the Calendar formatting is done with javascript [**_Intl_**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getCalendars#supported_calendar_types) avalible calendars : 
   `buddhist`,`chinese`,`coptic`,`dangi`,`ethioaa`,`ethiopic`,`gregory`,`hebrew`,`indian`,`islamic`,`islamic-umalqura`,`islamic-umalqura`,`islamic-tbla`,`islamic-civil`,`islamic-rgsa`,`iso8601`,`iso8601`,`japanese`,`persian`,`roc`,`islamicc`
  
   ```jsx
    <FullEventCalendar 
      // ...
      calendar={"persian"},
      // ..
    />
   ```
### `locale`
  - Type : String
  - Default : 'en-US'

    The BCP 47 language tag for the locale actually used. If any Unicode extension values were requested in the input BCP 47 language tag that led to this locale, the key-value pairs that were requested and are supported for this locale are included in locale.
    [**_Intl Locales_**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument)
  
   ```js
     // ...
     locale="fa-IR",
     // ..
   ```
### `grid`
  - Type : String
  - Default : 'daily'

    which grid plugin to show. options are : 
    `daily`,`weekly`,`month`,`list`
 
### `gridHeight`
  - Type : Number
  - Default : 1920

    height of the daily and weekly grid(not the container). for example if we consider every hour 60px then th grid hieght will be 60 * 24
   ```jsx
     // ...
     gridHeight={60 * 24}
     // ..
   ```
### `containerHeight`
  - Type : Number
  - Default : 600

    height of the entire container.
   ```js
     // ...
     containerHeight={700}
     // ..
   ```
### `editable`
  - Type : Boolean
  - Default : true

    can add or update event with dragging
   <!-- ```js
     // ...
     editable: false,
     // ..
   ``` -->
### `groups`
  - Type : Array
  - Default : []

     An array of resource objects. If provided, the daily grid will be divided into grouped resources, and only events containing the group ID property will be displayed on the corresponding grid resource.
  
    ```jsx
    import { useEffect, useState } from 'react'
    import { FullEventCalendar } from 'roozaneh'
    import { DailyGridPlugin } from '@roozaneh/daily-grid'
    import '@roozaneh/core/dist/main.css' // this must be imported
    // import { MonthGridPlugin } from '@roozaneh/month-grid'
    // import { WeeklyGridPlugin } from '@roozaneh/weekly-grid'
    // import { ListPlugin } from '@roozaneh/list'

    const events = [
          {
            name: 'some name',
            start: new Date('Aug 10 2023 08:00:0'),
            end: new Date('Aug 10 2023 10:00:00'),
            id: 16123,
            color: '#BF51F9',
            groups: [2]
          },
          {
            name: 'some name',
            start: new Date('Aug 10 2023 10:00:0'),
            color: '#31B5F7',
            end: new Date('Aug 10 2023 11:00:00'),
            id: 18123,
            groups: [1]
          },
      ]
 
    const groups = [{ id:1, name:'resource 1' },{ id:2, name:'resource 2' }]
 
    function App() {
      const [initialDate, setInitialDate] = useState(new Date('Thu Aug 10 2023 15:00:0'))
      const [events, setEvents] = useState(eventsList)

      function eventUpdate({prev,next,id}) {
          console.log('updated event : ' ,prev)
          console.log('to event : ' ,next)
          console.log('with id : ' ,id)
          // eventsList.value.push(data.next.sourceEvent)
      }

    return (
        <FullEventCalendar
            plugins={[DailyGridPlugin]}
            events={eventsR} 
            initialDate={count}
            eventUpdate={onEveUpdate}
            groups={groups}
        ></FullEventCalendar>
      )
  
    }
    ```
    ```ts
      interface Group {
         id:string[] | number[]
         name:string
      }
    ```


### `theme`
  - Type : String
  - Default : light

    sets the theme of calendar. can be ethier `light` or `dark`.
  <!-- ```js
     // ...
     theme: 'dark',
     // ..
   ``` -->
### `listMode`
  - Type : String
  - Default : day

    sets the `list` grids formatting. avalible
  `day`, `week`, `month`
  <!-- ```js
   // ...
   listMode: `week`,
   // ..
   ``` -->
   
### `timeZone`
  - Type : String
  - Default : Intl.DateTimeFormat().resolvedOptions().timeZone

    The time zone to use. The only value implementations must recognize is "UTC"; the default is the runtime's default time zone. Implementations may also recognize the time zone names of the IANA time zone database, such as `Asia/Shanghai`, `Asia/Kolkata`, `America/New_York`.
    or just run this code to see the avalible timeZones :
    ```js
    console.log(Intl.supportedValuesOf('timeZone'));
    ```
       <!-- ```js
        // ...
       timeZone: 'Africa/Abidjan',
       // ..
       ``` -->
### `autoUpdateEventOnChange`
  - Type : boolean
  - Default : true
  If set to false, all event dragging, editing, and additions will not be updated on the grid and instead will have to be handled with event listeners or modals.
    ```jsx
    import { useEffect, useState } from 'react'
    import { FullEventCalendar } from 'roozaneh'
    import { DailyGridPlugin } from '@roozaneh/daily-grid'
    import '@roozaneh/core/dist/main.css' // this must be imported


    const events = [
          {
            name: 'some name',
            start: new Date('Aug 10 2023 08:00:0'),
            end: new Date('Aug 10 2023 10:00:00'),
            id: 16123,
            color: '#BF51F9',
          },
          {
            name: 'some name',
            start: new Date('Aug 10 2023 10:00:0'),
            color: '#31B5F7',
            end: new Date('Aug 10 2023 11:00:00'),
            id: 18123,
          },
      ]
 
 
    function App() {

      const [initialDate, setInitialDate] = useState(new Date('Thu Aug 10 2023 15:00:0'))
      const [events, setEvents] = useState(eventsList)

      const onEveUpdate = (data)=>{
          const eventsCopy = [...eventsR] 
          let ind = eventsCopy.findIndex(item=>item.id === data.id)
          eventsCopy[ind] = data.next.sourceEvent
          setEvents(eventsCopy)
      }
     function eventAdd({event}){
        const eventsCopy = [...eventsR] 
        eventsCopy.push(event.sourceEvent)
        setEvents(eventsCopy)
     }     

    return (
        <FullEventCalendar
            autoUpdateEventOnChange={false}
            plugins={[DailyGridPlugin]}
            events={events} 
            eventAdd={eventAdd}
            eventUpdate={onEveUpdate}
            initialDate={initialDate}
            eventUpdate={onEveUpdate}
        ></FullEventCalendar>
      )
  
    }
    ```

### `stopAddEvent`
  - Type : boolean
  - Default : false
  If stopAddEvent is set to true, adding an event will be frozen on the grid to display a modal or perform another action,a modal should be provided with [**_Slots_**](#slots)"
```jsx
 function App() {

      const [initialDate, setInitialDate] = useState(new Date('Thu Aug 10 2023 15:00:0'))
      const [events, setEvents] = useState(eventsList)
 
     function eventStoped({event}){
        const eventsCopy = [...eventsR] 
        eventsCopy.push(event.sourceEvent)
        setEvents(eventsCopy)
     }

    return (
        <FullEventCalendar
            autoUpdateEventOnChange={false}
            plugins={[DailyGridPlugin]}
            events={events} 
            addEventStoped={eventStoped}
            eventUpdate={onEveUpdate}
            initialDate={initialDate}
        ></FullEventCalendar>
      )
    }
```

or with modal :

```jsx
 function EventaddModalSlot(props){
  
       function saveBtnClik(){
          props.saveModal() // call this to close the modal
          props.someProp(props.eventData.sourceEvent)
        }
        return (
         <div className='eventAddModal' style={{background:'red'}} >react modal
            {props?.eventData?.start.toString()} - {props?.eventData?.end.toString()}
           <button className='' onClick={saveBtnClik}>SAVE</button>
         </div>
        )
 }

 function App() {

      const [initialDate, setInitialDate] = useState(new Date('Thu Aug 10 2023 15:00:0'))
      const [events, setEvents] = useState(eventsList)
 
      function addEventModal(ev){
       let arr = [...eventsR,ev]
       setEvents(arr)
      }

    return (
        <FullEventCalendar
            autoUpdateEventOnChange={false}
            plugins={[DailyGridPlugin]}
            events={events} 
            initialDate={initialDate}
            addModal={<EventaddModalSlot someProp={addEventModal}/>}
        ></FullEventCalendar>
      )
 }
```

#### Source Event properties

```ts
interface SourceEvent {
  start: Date
  end: Date
  name: string
  id: any
  color?: string
  groups?: number[] | string[]
}

```
 
## Events

| Event Name                         | Description                                                                                         |
|------------------------------------|:----------------------------------------------------------------------------------------------------|
| `eventClicked({event})`            | fired when a event is clicked on a grid                                                             |
| `eventUpdate({ prev, next, id })`  | fired when a event is Updated on a grid with drag n drop                                            |
| `eventAdd({event})`                | fired when a event is Added on a grid with drag n drop                                              |
| `addEventStoped({event})`          | fired when a event is Added on a grid with drag n drop and the stopAddEvent option is set top true  |
| `dateUpdate({date})`               | fired when the initial date updates                                                                 |
| `gridUpdate({grid})`               | fired when the grid type updates                                                                    |
| `update:events(Array[])`           | fired when event list Updates                                                                       |
| `update:initial-date(date)`        | fired when initial-date changes                                                                     |
| `update:grid(string)`              | fired when grid type changes                                                                        |

## Customization

**Every section of the calendar can be customized with React components.**
Pass either a React element or a component type - for every section the calendar
hands over its data as typed props ( `event` , `date` , `timeText` , action
callbacks like `goToday` / `changeGrid` ... ).

### Components map

The recommended way is the `components` prop :

```tsx
import {
  FullEventCalendar, DailyGridPlugin, WeeklyGridPlugin, MonthGridPlugin, ListPlugin,
  TodayButton, EventItemCard, HeaderDate
} from 'roozaneh'

<FullEventCalendar
  plugins={[DailyGridPlugin, WeeklyGridPlugin, MonthGridPlugin, ListPlugin]}
  events={events}
  components={{
    // a component type
    todayBtn: TodayButton,
    // or a react element
    goBackDate: <button>‹</button>,
    // or a render function
    headerDateSlot: (props) => <b>{props.date}</b>,
    // wrap a default component and extend it
    eventItem: (props) => (
      <div style={{ opacity: 0.9 }}>
        <EventItemCard {...props} />
      </div>
    )
  }}
/>
```

Sections that are not customized fall back to the built-in ui. Customizing a
section only replaces its **content** - positioning, colors, drag & drop,
resize and click behaviour of the native calendar stay intact.

| Section            | Where                                                        |
|--------------------|:-------------------------------------------------------------|
| `todayBtn`         | header - the "today" button                                  |
| `goBackDate`       | header - the back arrow                                      |
| `goForwardDate`    | header - the forward arrow                                   |
| `headerDateSlot`   | header - the big date text                                   |
| `gridDropDown`     | header - the grid picker                                     |
| `dailyHeader`      | daily / weekly grids - a day column header                   |
| `timeRange`        | daily / weekly grids - an hour label of the time column      |
| `groupContainer`   | daily grid - a group ( resource ) header                     |
| `eventItem`        | daily / weekly grids - content of a timed event card         |
| `monthEvent`       | month grid & weekly all-day row - content of an event card   |
| `allDayEvent`      | daily grid - content of an all-day event chip                |
| `monthDay`         | month grid - a day cell content                              |
| `monthWeekDay`     | month grid - a week day label of the header                  |
| `listDateHeader`   | list grid - a date group header                              |
| `listEvent`        | list grid - an event row content                             |
| `eventClick`       | modal shown when an event is clicked                         |
| `addModal`         | modal shown when an event is drag created ( `stopAddEvent` ) |

### Default components

The calendar's default ui is also available as React components - import them,
wrap them, restyle them :

```tsx
import {
  TodayButton, GoBackButton, GoForwardButton, HeaderDate, GridDropdown,
  DailyHeader, TimeRangeLabel, GroupContainer, EventItemCard, MonthEventCard,
  AllDayEventCard, MonthDayLabel, MonthWeekDayLabel, ListDateHeader, ListEventRow,
  EventClickModal, AddEventModal
} from 'roozaneh'

// they render with the calendar's own css classes so they look
// exactly like the built-in ui and react to the active theme
components={{
  todayBtn: TodayButton,
  // extend one
  eventItem: (props) => <EventItemCard {...props} />,
  // wire the modals with your own actions
  eventClick: (props) => <EventClickModal {...props} onDelete={deleteEvent} />,
  addModal: (props) => <AddEventModal {...props} onAdd={addEvent} />
}}
```

### Slot props

Every section receives its data as typed props ( all fully typed in
`roozaneh` ) :

```ts
interface EventItemSlotProps {
  event?: CalendarEvent     // id , name , start , end , color , isAllDay() ...
  timeText?: string         // pre-formatted time range
  isAllDay?: boolean
  locale?: string
}

interface TodayButtonSlotProps {
  goToday?: () => void      // wired to the calendar
  locale?: string
}

interface GridDropdownSlotProps {
  grid?: GridMode
  grids?: GridMode[]        // available grids of installed plugins
  changeGrid?: (g: GridMode) => void
  locale?: string
}

interface MonthDaySlotProps {
  date?: Date; day?: string; monthName?: string
  isToday?: boolean; isInsideMonth?: boolean
  locale?: string; calendar?: string
}
// ...and so on for every section
```

### Direct slot props

Each section can also be customized directly as a prop ( the slot name is the
prop name ). Both work the same - the `components` map is just the tidy way to
group them :

```jsx
<FullEventCalendar
  todayBtn={<button>today</button>}
  eventItem={(props) => <MyCard {...props} />}
  eventClick={<MyEventModal />}
></FullEventCalendar>
```

## Imperative api

The calendar's imperative api is available through `ref` or `onReady` :

```tsx
const apiRef = useRef<CalendarApi | null>(null)

<FullEventCalendar
  ref={apiRef}
  onReady={(api) => console.log('calendar ready', api.getEvents())}
  plugins={PLUGINS}
  events={events}
/>

// apiRef.current.*
api.prev()                    // one step back ( day/week/month by grid )
api.next()                    // one step forward
api.goToday()                 // jump to today
api.getDate()                 // currently visible date
api.getGrid()                 // 'daily' | 'weekly' | 'month' | 'list'
api.getEvents()               // all events ( raw source events )
api.getEventById(id)
api.addEvent(event)           // add from outside the calendar
api.updateEvent(id, event)
api.deleteEvent(id)
api.changeGrid('month')       // + changeTheme / changeLocale / changeCalendar /
api.changeTimeZone('UTC')     //   changeDirection / updateListMode / updateGroups /
api.refresh()                 //   updateEditable / setGridHeight / changeContainerHeight
```

## Styling

### Css varibles
to use sass varibles import the SCSS file insted of Css, then import custom varibles,
example:

Css varibles:
```css
.calendar-theme-light {
  --shadow: 0px 4px 4px 0px rgba(60, 64, 67, 0.3), 0px 8px 12px 6px rgba(60, 64, 67, 0.15);
  --now: rgb(234, 67, 53);
  --primary: #31b5f7;
  --hairline: rgb(218, 220, 224);
  --on-surface-variant-agm: #70757a;
  --on-surface-variant: rgb(95, 99, 104);
  --textfield-surface: rgb(32, 33, 36);
  --bg-color:white;
  --bg-hover:rgba(208, 208, 208, 0.38);
  --shawdow:inset 0 0 0.5px 1px hsla(0, 0%,   100%, 0.075),  0 0 0 1px hsla(0, 0%, 0%, 0.05),
  0 0.3px 0.4px hsla(0, 0%, 0%, 0.02),
  0 0.9px 1.5px hsla(0, 0%, 0%, 0.045),
  0 3.5px 6px hsla(0, 0%, 0%, 0.09);
}

.calendar-theme-dark {
  --now: rgb(234, 67, 53);
  --primary: #3499F5;
  --hairline: #3a536b;
  --on-surface-variant-agm: #BBBBBB;
  --on-surface-variant: #FFFFFF;
  --textfield-surface: #E6E6E6;
  --bg-color:#243443;
  --bg-hover:#3f4d5a;
  --shawdow:inset 0 0 0.5px 1px hsla(0, 0%,   100%, 0.075),  0 0 0 1px hsla(0, 0%, 0%, 0.05),
  0 0.3px 0.4px hsla(0, 0%, 0%, 0.02),
  0 0.9px 1.5px hsla(0, 0%, 0%, 0.045),
  0 3.5px 6px hsla(0, 0%, 0%, 0.09);
}

```

## Contributing

``` bash
$ pnpm i
# dev server
$ pnpm run dev
```

## License

roozaneh is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).