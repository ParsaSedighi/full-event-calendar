import type { AllDayEventSlotProps } from '../../types'

/** default content of an all day event chip of the daily grid.
 *  the chip wrapper ( background color , click ) stays native */
export function AllDayEventCard({ event }: AllDayEventSlotProps) {
  return <>{`${event?.name ?? ''} `}</>
}
