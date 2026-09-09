import type { GroupContainerSlotProps } from '../../types'
import { cx } from '../../utils/classNames'

/** default group ( resource ) header of the daily grid.
 *  styled like the built in one - name + first letter avatar.
 *  `className` is appended to the container so tailwind utilities work */
export function GroupContainer({ group, className }: GroupContainerSlotProps) {
  const name: string = group?.name ?? ''
  return (
    <div className={cx('fec-groupContainer', className)}>
      <div className="fec-group-name">{name}</div>
      <div className="fec-group-avatar">{name.charAt(0)}</div>
    </div>
  )
}
