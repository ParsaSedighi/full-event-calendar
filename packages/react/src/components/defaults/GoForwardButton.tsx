import type { GoForwardButtonSlotProps } from '../../types'

/** default forward arrow of the calendar header.
 *  looks exactly like the built in one ( rotated 180deg ) */
export function GoForwardButton(_: GoForwardButtonSlotProps) {
  return (
    <div className="fec-go-forward-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M13.28 10.0333L8.93333 5.68667C8.42 5.17333 7.58 5.17333 7.06667 5.68667L2.72 10.0333"
          stroke="#7E7E7F"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
