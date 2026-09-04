import { describe, expect, test } from 'vitest'
import { getDayColumn, getFirstDayOfWeek, getLocaleLanguage, getTextDirection, getWeekDates, isRTL } from '../src'

describe('getTextDirection', () => {
  test('resolves rtl locales', () => {
    expect(getTextDirection('fa-IR')).toBe('rtl')
    expect(getTextDirection('fa')).toBe('rtl')
    expect(getTextDirection('ar-EG')).toBe('rtl')
    expect(getTextDirection('he-IL')).toBe('rtl')
    expect(getTextDirection('ur-PK')).toBe('rtl')
    expect(isRTL('fa-IR')).toBe(true)
  })

  test('resolves ltr locales', () => {
    expect(getTextDirection('en-US')).toBe('ltr')
    expect(getTextDirection('de-DE')).toBe('ltr')
    expect(getTextDirection('zh-CN')).toBe('ltr')
    expect(isRTL('en-US')).toBe(false)
  })

  test('does not throw on invalid locales', () => {
    expect(getTextDirection('')).toBe('ltr')
  })
})

describe('getFirstDayOfWeek', () => {
  test('fa-IR weeks start on Saturday', () => {
    expect(getFirstDayOfWeek('fa-IR')).toBe(6)
  })

  test('en-US weeks start on Sunday', () => {
    expect(getFirstDayOfWeek('en-US')).toBe(0)
  })

  test('de-DE weeks start on Monday', () => {
    expect(getFirstDayOfWeek('de-DE')).toBe(1)
  })

  test('falls back to known languages', () => {
    expect(getFirstDayOfWeek('fa')).toBe(6)
    expect(getFirstDayOfWeek('ar')).toBe(6)
  })

  test('falls back to Sunday for invalid locales', () => {
    expect(getFirstDayOfWeek('not a locale!')).toBe(0)
  })
})

describe('getDayColumn', () => {
  test('sunday first week', () => {
    expect(getDayColumn(new Date(' Aug 06 2023 '), 0)).toBe(0) // Sunday
    expect(getDayColumn(new Date(' Aug 12 2023 '), 0)).toBe(6) // Saturday
  })

  test('saturday first week', () => {
    expect(getDayColumn(new Date(' Aug 05 2023 '), 6)).toBe(0) // Saturday
    expect(getDayColumn(new Date(' Aug 11 2023 '), 6)).toBe(6) // Friday
    expect(getDayColumn(new Date(' Aug 06 2023 '), 6)).toBe(1) // Sunday
  })
})

describe('getWeekDates', () => {
  test('default week starts on Sunday', () => {
    const week = getWeekDates(new Date(' Aug 09 2023 10:00:00'))
    expect(week[0].getDay()).toBe(0)
    expect(week[6].getDay()).toBe(6)
    expect(week[0].getDate()).toBe(6)
    expect(week[6].getDate()).toBe(12)
  })

  test('fa-IR week starts on Saturday', () => {
    const week = getWeekDates(new Date(' Aug 09 2023 10:00:00'), 6)
    expect(week[0].getDay()).toBe(6) // Saturday
    expect(week[6].getDay()).toBe(5) // Friday
    expect(week[0].getDate()).toBe(5)
    expect(week[6].getDate()).toBe(11)
  })

  test('does not mutate the given date', () => {
    const date = new Date(' Aug 09 2023 10:00:00')
    getWeekDates(date, 6)
    expect(date.getDate()).toBe(9)
  })
})

describe('getLocaleLanguage', () => {
  test('extracts the language subtag', () => {
    expect(getLocaleLanguage('fa-IR')).toBe('fa')
    expect(getLocaleLanguage('en-US')).toBe('en')
    expect(getLocaleLanguage('uz_Latn')).toBe('uz')
  })
})
