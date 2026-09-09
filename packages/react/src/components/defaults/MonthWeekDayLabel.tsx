import type { MonthWeekDaySlotProps } from '../../types'

/** default week day label of the month grid header.
 *  `className` wraps the label so tailwind utilities work */
export function MonthWeekDayLabel({ label, className }: MonthWeekDaySlotProps) {
  return <span className={className}>{label ?? ''}</span>
}
