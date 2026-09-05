import type { CSSProperties } from 'react'
import type { EventClickModalSlotProps } from '../../types'
import { formatTimeRange } from '../../utils/format'

const modalStyle: CSSProperties = {
  background: 'var(--bg-color)',
  boxShadow: 'var(--shadow)',
  borderRadius: '12px',
  padding: '16px',
  minWidth: '230px',
  color: 'var(--on-surface-variant)',
  fontFamily: 'inherit',
  transform: 'translateX(-50%)'
}

const rowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
  fontSize: '13px',
  margin: '6px 0'
}

const actionsStyle: CSSProperties = {
  display: 'flex',
  gap: '8px',
  justifyContent: 'flex-end',
  marginTop: '14px'
}

const primaryBtn: CSSProperties = {
  background: 'var(--primary)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '8px 14px',
  cursor: 'pointer',
  fontSize: '13px'
}

const secondaryBtn: CSSProperties = {
  background: 'transparent',
  color: 'var(--on-surface-variant)',
  border: 'none',
  borderRadius: '8px',
  padding: '8px 14px',
  cursor: 'pointer',
  fontSize: '13px'
}

/** default modal shown when an event is clicked.
 *  extend it with your own actions ( pass `onDelete` , `onUpdate`... when
 *  using it as the `eventClick` component ) */
export function EventClickModal(props: EventClickModalSlotProps & { onDelete?: (id: any) => void }) {
  const { eventData, event, saveModal, close, locale, onDelete } = props
  const ev = event || eventData
  const closeFn = saveModal || close

  return (
    <div style={modalStyle}>
      <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{ width: '10px', height: '10px', borderRadius: '50%', background: ev?.color || 'var(--primary)' }}
        />
        {ev?.name}
      </div>
      <div style={rowStyle}>
        <span>start</span>
        <span>{formatTimeRange(ev?.start, ev?.start, locale)}</span>
      </div>
      <div style={rowStyle}>
        <span>end</span>
        <span>{formatTimeRange(ev?.end, ev?.end, locale)}</span>
      </div>
      <div style={rowStyle}>
        <span>id</span>
        <span>{String(ev?.id)}</span>
      </div>
      <div style={actionsStyle}>
        {onDelete && (
          <button style={primaryBtn} onClick={() => onDelete(ev?.id)}>
            Delete
          </button>
        )}
        <button style={secondaryBtn} onClick={() => closeFn?.()}>
          Close
        </button>
      </div>
    </div>
  )
}
