import type { GroupContainerSlotProps } from '../../types'

/** default group ( resource ) header of the daily grid.
 *  styled like the built in one - name + first letter avatar */
export function GroupContainer({ group }: GroupContainerSlotProps) {
  const name: string = group?.name ?? ''
  return (
    <div className="fec-groupContainer">
      <div className="fec-group-name">{name}</div>
      <div className="fec-group-avatar">{name.charAt(0)}</div>
    </div>
  )
}
