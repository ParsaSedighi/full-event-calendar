import type { HeaderDateSlotProps } from '../../types'

/** default date text of the calendar header.
 *  `date` arrives already formatted with the active locale / calendar / time zone.
 *  the slot container itself already carries the `fec-header-date` styling -
 *  `className` lands on this text node so tailwind utilities work */
export function HeaderDate({ date, className }: HeaderDateSlotProps) {
  return <div className={className}>{date ?? ''}</div>
}
