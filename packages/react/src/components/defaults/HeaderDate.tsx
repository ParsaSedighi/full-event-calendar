import type { HeaderDateSlotProps } from '../../types'

/** default date text of the calendar header.
 *  `date` arrives already formatted with the active locale / calendar / time zone */
export function HeaderDate({ date }: HeaderDateSlotProps) {
  return <div className="fec-header-date">{date ?? ''}</div>
}
