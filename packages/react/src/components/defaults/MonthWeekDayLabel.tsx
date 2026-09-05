import type { MonthWeekDaySlotProps } from '../../types'

/** default week day label of the month grid header */
export function MonthWeekDayLabel({ label }: MonthWeekDaySlotProps) {
  return <>{label ?? ''}</>
}
