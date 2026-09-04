// languages that are written right to left , used as a fallback when
// Intl.Locale.prototype.getTextInfo is not available in the runtime
const RTL_LANGUAGES = new Set([
  'ar', // Arabic
  'arc', // Aramaic
  'azb', // South Azerbaijani
  'ckb', // Central Kurdish
  'dv', // Divehi
  'fa', // Persian
  'glk', // Gilaki
  'ha', // Hausa (when written in arabic script)
  'he', // Hebrew
  'iw', // Hebrew (legacy code)
  'kak', // Kalmyk
  'ks', // Kashmiri (arabic script)
  'mzn', // Mazanderani
  'nqo', // N'Ko
  'pnb', // Western Punjabi
  'ps', // Pashto
  'sd', // Sindhi
  'ug', // Uyghur
  'ur', // Urdu
  'yi' // Yiddish
])

// fallback first day of week (JS getDay()) used when Intl `getWeekInfo`
// is not available in the runtime , matches the CLDR data of the common locales
const FIRST_DAY_FALLBACK: Record<string, number> = {
  // Saturday
  fa: 6,
  ar: 6,
  ps: 6,
  // Friday
  dv: 5,
  // Monday
  de: 1,
  fr: 1,
  es: 1,
  it: 1,
  nl: 1,
  pl: 1,
  ru: 1,
  uk: 1,
  cs: 1,
  sk: 1,
  hu: 1,
  ro: 1,
  bg: 1,
  el: 1,
  sv: 1,
  da: 1,
  nb: 1,
  nn: 1,
  fi: 1,
  tr: 1,
  et: 1,
  lv: 1,
  lt: 1,
  hr: 1,
  sl: 1,
  sr: 1,
  sq: 1,
  ca: 1,
  eu: 1,
  gl: 1,
  az: 1,
  kk: 1,
  ky: 1,
  uz: 1,
  mn: 1,
  tg: 1,
  ba: 1,
  hy: 1,
  ka: 1,
  ms: 1,
  zh: 1
}

export type TextDirection = 'rtl' | 'ltr'

const directionCache = new Map<string, TextDirection>()
const firstDayCache = new Map<string, number>()

function resolveLocale(locale: string): Intl.Locale | null {
  try {
    return new Intl.Locale(locale)
  } catch {
    return null
  }
}

/**
 * resolves the writing direction of a locale.
 * uses Intl `getTextInfo` when available and falls back to a list of known RTL languages
 * @example getTextDirection('fa-IR') // 'rtl'
 * @example getTextDirection('en-US') // 'ltr'
 */
export function getTextDirection(locale: string): TextDirection {
  const cacheKey = String(locale)
  const cached = directionCache.get(cacheKey)
  if (cached) return cached

  let direction: TextDirection = 'ltr'
  const intlLocale = resolveLocale(cacheKey)

  if (intlLocale) {
    // @ts-ignore getTextInfo is not part of every TS lib definition
    const textInfo = intlLocale.getTextInfo?.()
    if (textInfo?.direction) {
      direction = textInfo.direction === 'rtl' ? 'rtl' : 'ltr'
    }
  }

  if (direction === 'ltr') {
    const language = getLanguage(cacheKey)
    if (RTL_LANGUAGES.has(language)) direction = 'rtl'
  }

  directionCache.set(cacheKey, direction)
  return direction
}

/**
 * @example isRTL('fa-IR') // true
 */
export function isRTL(locale: string): boolean {
  return getTextDirection(locale) === 'rtl'
}

/**
 * resolves the first day of the week of a locale as a JS `Date.getDay()` number
 * (0 = Sunday , 6 = Saturday ...).
 * uses Intl `getWeekInfo` when available and falls back to common known locales
 * @example getFirstDayOfWeek('fa-IR') // 6 (Saturday)
 * @example getFirstDayOfWeek('en-US') // 0 (Sunday)
 */
export function getFirstDayOfWeek(locale: string): number {
  const cacheKey = String(locale)
  const cached = firstDayCache.get(cacheKey)
  if (cached !== undefined) return cached

  let firstDay: number | undefined
  const intlLocale = resolveLocale(cacheKey)

  if (intlLocale) {
    // @ts-ignore getWeekInfo is not part of every TS lib definition
    const weekInfo = intlLocale.getWeekInfo?.()
    // CLDR week info returns 1 (Monday) to 7 (Sunday)
    if (weekInfo?.firstDay) {
      firstDay = weekInfo.firstDay % 7
    }
  }

  if (firstDay === undefined) {
    const language = getLanguage(cacheKey)
    firstDay = FIRST_DAY_FALLBACK[language] ?? 0
  }

  firstDayCache.set(cacheKey, firstDay)
  return firstDay
}

/**
 * converts a date week day (Date.getDay()) to a column index of a week
 * that starts on `firstDay`
 * @example getDayColumn(new Date('2023-08-10'), 6) // week starts on Saturday
 */
export function getDayColumn(date: Date, firstDay: number = 0): number {
  return (date.getDay() - firstDay + 7) % 7
}

/**
 * extracts the language subtag of a locale
 * @example getLocaleLanguage('fa-IR') // 'fa'
 */
export function getLocaleLanguage(locale: string): string {
  return getLanguage(locale)
}

function getLanguage(locale: string): string {
  return String(locale).split(/[-_@]/)[0].toLowerCase()
}
