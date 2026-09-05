import type { TimeRangeSlotProps } from '../../types'
import { formatShortTime } from '../../utils/format'

/** default hour label of the daily / weekly time column.
 *  renders '' for the top row like the built in one */
export function TimeRangeLabel({ time, locale }: TimeRangeSlotProps) {
  const label = time ? formatShortTime(time, locale) : ''
  return (
    <>
      <div className="fec-time-range-time">{label}</div>
      <div className="fec-time-range-hairline"></div>
    </>
  )
}
