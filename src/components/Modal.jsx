import React from 'react'

function Modal({ open, title, children, onClose, actions }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/70" onClick={onClose} />
      <div className="relative z-10 w-[90%] max-w-md rounded-2xl bg-white shadow-2xl p-6">
        {title && <h3 className="text-xl font-semibold text-slate-800 mb-3">{title}</h3>}
        <div className="text-slate-700 mb-4">
          {children}
        </div>
        {actions && (
          <div className="flex gap-3 justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
