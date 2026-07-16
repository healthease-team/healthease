import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  maxWidthClass?: string
}

export default function Modal({ open, onClose, title, children, maxWidthClass = 'max-w-2xl' }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-brand-navy/50" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className={`relative bg-surface rounded-2xl shadow-card-hover w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto`}>
          {title && (
            <div className="flex items-center justify-between p-4 border-b border-brand-navy/10">
              <h5 className="text-lg font-semibold text-brand-navy">{title}</h5>
              <button
                type="button"
                className="text-text-muted-2 hover:text-brand-navy text-2xl leading-none"
                onClick={onClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          )}
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  )
}
