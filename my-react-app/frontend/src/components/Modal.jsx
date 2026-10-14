import { useEffect, useRef } from 'react'
import { CloseIcon } from './Icons.jsx'

function Modal({ title, onClose, tone = 'dark', size = 'md', children, titleClassName = '' }) {
  const panelRef = useRef(null)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    panelRef.current.querySelector('input, select, textarea')?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="shared-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={panelRef} className={`shared-modal shared-modal-${tone} shared-modal-${size}`}>
        <button type="button" className="shared-close-x" onClick={onClose} aria-label="Close">
          <CloseIcon size={26} />
        </button>
        <h2 className={`shared-display shared-modal-title ${titleClassName}`.trim()}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}

export default Modal
