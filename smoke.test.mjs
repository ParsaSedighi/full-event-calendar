import { JSDOM } from 'jsdom'
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>', { url: 'http://localhost' })
global.window = dom.window
global.document = dom.window.document
global.Node = dom.window.Node

const { Calendar } = await import('./packages/core/dist/index.js')
const { DailyGridPlugin } = await import('./packages/daily-grid/dist/index.js')
const { WeeklyGridPlugin } = await import('./packages/weekly-grid/dist/index.js')
const { MonthGridPlugin } = await import('./packages/month-grid/dist/index.js')
const { ListPlugin } = await import('./packages/list/dist/index.js')

const events = [
  {
    name: 'جلسه تیم',
    start: new Date(' Sep 04 2026 08:00:00'),
    end: new Date(' Sep 04 2026 10:00:00'),
    id: 1,
    color: '#BF51F9'
  },
  {
    name: 'all day test',
    start: new Date(' Sep 04 2026 00:00:00'),
    end: new Date(' Sep 04 2026 23:59:00'),
    id: 2,
    color: '#31B5F7'
  }
]

const cal = new Calendar(document.getElementById('app'), {
  events,
  plugins: [DailyGridPlugin, WeeklyGridPlugin, MonthGridPlugin, ListPlugin],
  locale: 'fa-IR',
  calendar: 'persian',
  grid: 'daily'
})
cal.render()

const root = document.getElementById('full-event-calendar-core')
console.log('=== root ===')
console.log('dir:', root.getAttribute('dir'))
console.log('class:', root.getAttribute('class'))
console.log('=== header ===')
console.log('today btn:', root.querySelector('.fec-go-to-today')?.textContent)
console.log('header date:', root.querySelector('.fec-header-date')?.textContent)
console.log('header date dir:', root.querySelector('.fec-header-date')?.getAttribute('dir'))
console.log(
  'time labels:',
  [...root.querySelectorAll('.fec-time-range-time')].slice(1, 4).map((e) => e.textContent)
)
console.log('event name:', root.querySelector('.fec-event-name')?.textContent)
console.log('event time:', root.querySelector('.event-time-detals')?.textContent)

cal.changeGrid('weekly')
await new Promise((r) => setTimeout(r, 50))
console.log('=== weekly ===')
console.log(
  'weekdays:',
  [...root.querySelectorAll('.fec-header-dates .fec-weekend-narrow')].map((e) => e.textContent)
)

cal.changeGrid('month')
await new Promise((r) => setTimeout(r, 50))
console.log('=== month ===')
console.log(
  'month header:',
  [...root.querySelectorAll('.fec-month-header > div')].map((e) => e.textContent)
)
console.log('first visible day:', root.querySelector('.fec-month-container span')?.textContent)

cal.changeGrid('list')
await new Promise((r) => setTimeout(r, 50))
console.log('=== list ===')
console.log('list date:', root.querySelector('.fec-schedule-date')?.textContent)
console.log('list date short:', root.querySelector('.fec-schedule-dates')?.textContent)
console.log(
  'list item times:',
  [...root.querySelectorAll('.fec-event-date-list')].map((e) => e.textContent)
)

// ltr sanity check + direction override
const cal2 = new Calendar(document.createElement('div'), {
  events: [],
  plugins: [DailyGridPlugin],
  locale: 'en-US'
})
cal2.render()
console.log('=== en-US ===')
console.log('dir:', cal2['targetElement'] ? '' : '')
const root2 =
  cal2['targetElement']?.querySelector?.('#full-event-calendar-core') ||
  document.querySelectorAll('#full-event-calendar-core')[1]
console.log('en dir:', root2?.getAttribute('dir'), '| class:', root2?.getAttribute('class'))

const cal3 = new Calendar(document.createElement('div'), {
  events: [],
  plugins: [DailyGridPlugin],
  locale: 'fa-IR',
  direction: 'ltr'
})
cal3.render()
const root3 = cal3['targetElement']?.querySelector?.('#full-event-calendar-core')
console.log('fa-IR forced ltr dir:', root3?.getAttribute('dir'))
