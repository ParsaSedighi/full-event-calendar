import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { AddEventModalSlotProps } from '../../types'
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

const inputStyle: CSSProperties = {
  border: '1px solid var(--hairline)',
  background: 'transparent',
  color: 'var(--on-surface-variant)',
  borderRadius: '8px',
  padding: '6px 10px',
  fontSize: '13px',
  outline: 'none'
}

/** default modal shown when an event is drag created while `stopAddEvent`
 *  is enabled. wire it up by passing `onAdd` when using it as the `addModal`
 *  component : `components={{ addModal: (p) => <AddEventModal {...p} onAdd={addEvent} /> }}` */
export function AddEventModal(props: AddEventModalSlotProps & { onAdd?: (event: any) => void }) {
  const { eventData, event, saveModal, close, locale, onAdd } = props
  const ev = event || eventData
  const closeFn = saveModal || close
  const [name, setName] = useState('')

  function confirm() {
    onAdd?.({ ...(ev?.sourceEvent ?? ev), name: name || ev?.name || 'Untitled event' })
    closeFn?.()
  }

  return (
    <div style={modalStyle}>
      <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '8px' }}>New event</div>
      <div style={rowStyle}>
        <span>name</span>
        <input
          style={inputStyle}
          value={name}
          placeholder={ev?.name ?? 'Untitled event'}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div style={rowStyle}>
        <span>start</span>
        <span>{formatTimeRange(ev?.start, ev?.start, locale)}</span>
      </div>
      <div style={rowStyle}>
        <span>end</span>
        <span>{formatTimeRange(ev?.end, ev?.end, locale)}</span>
      </div>
      <div style={actionsStyle}>
        <button style={primaryBtn} onClick={confirm}>
          Add event
        </button>
        <button style={secondaryBtn} onClick={() => closeFn?.()}>
          Discard
        </button>
      </div>
    </div>
  )
}
