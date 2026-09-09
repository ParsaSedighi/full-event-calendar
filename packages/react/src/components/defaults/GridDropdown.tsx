import { useState } from 'react'
import type { GridDropdownSlotProps } from '../../types'
import { calendarLocale } from '@full-event-calendar/locale'
import { cx } from '../../utils/classNames'

/** default grid picker of the calendar header.
 *  styled like the built in dropdown and wired to `changeGrid` out of the box.
 *  `className` is appended to the dropdown so tailwind utilities work */
export function GridDropdown({ grid, grids, changeGrid, locale, className }: GridDropdownSlotProps) {
  const [open, setOpen] = useState(false)
  const options = grids?.length ? grids : (['daily', 'weekly', 'month', 'list'] as const)

  return (
    <div className={cx('fec-grid-drop', className)} data-test-id-dropdown="1" onClick={() => setOpen(!open)}>
      {calendarLocale(locale ?? 'en-US', grid || 'daily')}
      {open && (
        <div className="fec-dropdown-calendar">
          {options.map((option) => (
            <div
              key={option}
              className="fec-dropdown-calendar-item"
              data-test-id-drop="0"
              onClick={(e) => {
                e.stopPropagation()
                setOpen(false)
                changeGrid?.(option as any)
              }}
            >
              {calendarLocale(locale ?? 'en-US', option)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
