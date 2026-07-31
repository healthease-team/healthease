import Modal from '../ui/Modal'
import type { Order } from '#/lib/types'

export default function OrderDocsModal({ order, onClose }: { order: Order | null; onClose: () => void }) {
  return (
    <Modal open={!!order} onClose={onClose} title="Prescription & ID" maxWidthClass="max-w-md">
      {order && (
        <div className="space-y-4 text-sm text-text-muted">
          <div className="rounded-xl border border-dashed border-brand-navy/25 bg-mint-light/40 h-32 flex items-center justify-center">
            {/* TODO(phase-2): signed Supabase Storage URL preview */}
            <span>Prescription preview unavailable in mock mode</span>
          </div>
          <div className="rounded-xl border border-dashed border-brand-navy/25 bg-mint-light/40 h-32 flex items-center justify-center">
            <span>ID card preview unavailable in mock mode</span>
          </div>
        </div>
      )}
    </Modal>
  )
}
