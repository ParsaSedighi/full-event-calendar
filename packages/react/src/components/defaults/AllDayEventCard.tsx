import type { AllDayEventSlotProps } from '../../types'

/** default content of an all day event chip of the daily grid.
 *  the chip wrapper ( background color , click ) stays native.
 *  `className` wraps the name so tailwind utilities work */
export function AllDayEventCard({ event, className }: AllDayEventSlotProps) {
  return <span className={className}>{`${event?.name ?? ''} `}</span>
}
