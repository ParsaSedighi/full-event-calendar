import { describe, expect, test } from 'vitest'
import { Calendar } from '../packages/core/src/Calendar'
import { DailyGridPlugin } from '../packages/daily-grid/src'
import { WeeklyGridPlugin } from '../packages/weekly-grid/src'
import { MonthGridPlugin } from '../packages/month-grid/src'
import { ListPlugin } from '../packages/list/src'

const wait = (ms = 50) => new Promise((r) => setTimeout(r, ms))

describe('fa-IR calendar', () => {
  test('renders rtl with farsi content', async () => {
    const el = document.createElement('div')
    document.body.appendChild(el)

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

    const cal = new Calendar(el, {
      events,
      plugins: [DailyGridPlugin, WeeklyGridPlugin, MonthGridPlugin, ListPlugin],
      locale: 'fa-IR',
      calendar: 'persian',
      grid: 'daily'
    })
    cal.render()
    await wait()

    const root = el.querySelector('#full-event-calendar-core') as HTMLElement
    expect(root.getAttribute('dir')).toBe('rtl')
    expect(root.className).toContain('fec-rtl')
    expect(root.className).toContain('fec-locale-fa')
    expect(root.className).toContain('calendar-theme-light')

    // header
    expect(el.querySelector('.fec-go-to-today')?.textContent).toBe('امروز')
    expect(el.querySelector('.fec-header-date')?.getAttribute('dir')).toBe('rtl')
    expect(el.querySelector('.fec-header-date')?.textContent).toMatch(/۱۴۰۵/)

    // time labels are farsi digits
    const labels = [...el.querySelectorAll('.fec-time-range-time')].map((e) => e.textContent)
    expect(labels[1]).toBe('۰۱:۰۰')
    expect(labels[13]).toBe('۱۳:۰۰')

    // event content
    expect(el.querySelector('.fec-event-name')?.textContent).toBe('جلسه تیم')
    expect(el.querySelector('.event-time-detals')?.textContent).toBe('۰۸:۰۰ - ۱۰:۰۰')

    // grid dropdown is farsi
    expect(el.querySelector('.fec-grid-drop')?.textContent).toBe('روزانه')

    // weekly grid starts on Saturday (شنبه)
    cal.changeGrid('weekly')
    await wait()
    const weekdays = [...el.querySelectorAll('.fec-header-dates .fec-weekend-narrow')].map((e) => e.textContent)
    expect(weekdays[0]).toBe('شنبه')
    expect(weekdays[6]).toBe('جمعه')

    // month grid header starts on Saturday + farsi day numbers
    cal.changeGrid('month')
    await wait()
    const monthHeader = [...el.querySelectorAll('.fec-month-header > div')].map((e) => e.textContent)
    expect(monthHeader[0]).toBe('شنبه')
    expect(monthHeader[6]).toBe('جمعه')
    const firstDay = el.querySelector('.fec-month-container span')?.textContent
    expect(firstDay).toMatch(/[۰-۹]/)

    // list view is farsi with translated all day
    cal.changeGrid('list')
    await wait()
    expect(el.querySelector('.fec-schedule-date')?.textContent).toMatch(/[۰-۹]/)
    const listTimes = [...el.querySelectorAll('.fec-event-date-list')].map((e) => e.textContent)
    expect(listTimes.some((t) => t.includes('تمام روز'))).toBe(true)
    expect(listTimes.some((t) => t.includes('۰۸:۰۰'))).toBe(true)

    // no events state is farsi
    const cal2 = new Calendar(document.createElement('div'), {
      events: [],
      plugins: [ListPlugin],
      locale: 'fa-IR',
      calendar: 'persian',
      grid: 'list'
    })
    cal2.render()
    await wait()
    expect((cal2 as any).targetElement.querySelector('.fec-no-events-text')?.textContent).toBe('هیچ رویدادی نیست')
  })

  test('en-US stays ltr', async () => {
    const el = document.createElement('div')
    const cal = new Calendar(el, { events: [], plugins: [DailyGridPlugin], locale: 'en-US' })
    cal.render()
    await wait()
    const root = el.querySelector('#full-event-calendar-core') as HTMLElement
    expect(root.getAttribute('dir')).toBe('ltr')
    expect(root.className).toContain('fec-ltr')
    expect(root.className).not.toContain('fec-locale-fa')
    expect(el.querySelector('.fec-go-to-today')?.textContent).toBe('Today')
  })

  test('direction option overrides locale direction', async () => {
    const el = document.createElement('div')
    const cal = new Calendar(el, { events: [], plugins: [DailyGridPlugin], locale: 'fa-IR', direction: 'ltr' })
    cal.render()
    await wait()
    const root = el.querySelector('#full-event-calendar-core') as HTMLElement
    expect(root.getAttribute('dir')).toBe('ltr')
  })
})
