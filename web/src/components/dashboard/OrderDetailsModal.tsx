import Modal from '../ui/Modal'
import type { Order } from '#/lib/types'

export default function OrderDetailsModal({ order, onClose }: { order: Order | null; onClose: () => void }) {
  return (
    <Modal open={!!order} onClose={onClose} title="Delivery Details" maxWidthClass="max-w-md">
      {order && (
        <div className="space-y-2 text-sm text-text-muted">
          <div><span className="font-semibold text-brand-navy">Customer:</span> {order.customerName}</div>
          <div><span className="font-semibold text-brand-navy">Phone:</span> {order.phone}</div>
          <div><span className="font-semibold text-brand-navy">Address:</span> {order.deliveryAddress}</div>
          <div><span className="font-semibold text-brand-navy">Distance:</span> {order.distanceKm?.toFixed(1)}km</div>
          {order.customerLat && order.customerLng && (
            <a
              href={`https://www.google.com/maps?q=${order.customerLat},${order.customerLng}`}
              target="_blank"
              rel="noreferrer"
              className="text-link-blue hover:underline inline-flex items-center gap-1 mt-2"
            >
              <i className="bi bi-geo-alt" /> Open in Google Maps
            </a>
          )}
        </div>
      )}
    </Modal>
  )
}
