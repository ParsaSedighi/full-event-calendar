import type { HeaderDateSlotProps } from '../../types'

/** default date text of the calendar header.
 *  `date` arrives already formatted with the active locale / calendar / time zone.
 *  the slot container itself already carries the `fec-header-date` styling */
export function HeaderDate({ date }: HeaderDateSlotProps) {
  return <div>{date ?? ''}</div>
}
