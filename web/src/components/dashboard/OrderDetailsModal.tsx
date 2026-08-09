import Modal from '../ui/Modal'
import type { Order } from '#/lib/types'

export default function OrderDetailsModal({ order, onClose }: { order: Order | null; onClose: () => void }) {
  return <Modal open={!!order} onClose={onClose} title="Order Details" maxWidthClass="max-w-2xl">
    {order && <div className="space-y-5 text-sm text-text-muted">
      <section className="grid sm:grid-cols-2 gap-3 rounded-xl bg-mint-light/40 p-4"><div><b className="text-brand-navy">Customer:</b> {order.customerName}</div><div><b className="text-brand-navy">Phone:</b> {order.phone}</div><div><b className="text-brand-navy">Email:</b> {order.email}</div><div><b className="text-brand-navy">Order type:</b> <i className={`bi ${order.deliveryMethod === 'delivery' ? 'bi-truck' : 'bi-bag-check'} mx-1`} />{order.deliveryMethod}</div></section>
      <section><h3 className="font-bold text-brand-navy mb-2">Items ordered</h3>{order.items.map((item) => <div key={item.id} className="flex justify-between border-b border-brand-navy/10 py-2"><span>{item.productName} × {item.quantity}</span><span>SRD {(item.unitPrice * item.quantity).toFixed(2)}</span></div>)}<div className="flex justify-between pt-3 font-bold text-brand-navy"><span>Total</span><span>SRD {order.totalAmount.toFixed(2)}</span></div></section>
      <section className="rounded-xl border border-brand-navy/10 p-4"><h3 className="font-bold text-brand-navy mb-2">{order.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'} details</h3>{order.deliveryMethod === 'delivery' ? <><div><b>Address:</b> {order.deliveryAddress || 'Not provided'}</div><div><b>Distance:</b> {order.distanceKm?.toFixed(1) ?? '—'} km</div>{order.deliveryNotes && <div><b>Notes:</b> {order.deliveryNotes}</div>}{order.customerLat && order.customerLng && <a href={`https://www.google.com/maps?q=${order.customerLat},${order.customerLng}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-link-blue hover:underline"><i className="bi bi-geo-alt" /> Open map</a>}</> : <div><b>Pickup time:</b> {order.pickupTime || 'Customer will be notified when ready.'}</div>}</section>
      <section><h3 className="font-bold text-brand-navy mb-2">Customer documents</h3><div className="grid sm:grid-cols-2 gap-3"><DocumentCard label="Prescription" value={order.prescriptionPath} /><DocumentCard label="ID card" value={order.idCardPath} /></div></section>
    </div>}
  </Modal>
}

function DocumentCard({ label, value }: { label: string; value?: string }) {
  if (!value) return <div className="rounded-xl border border-dashed border-brand-navy/20 p-4 text-text-muted-2"><i className="bi bi-file-earmark-x" /> {label} unavailable</div>
  const isImage = value.startsWith('data:image/')
  return <a href={value} target="_blank" rel="noreferrer" download={`${label.toLowerCase().replace(' ', '-')}-document`} className="block rounded-xl border border-brand-navy/15 p-3 text-link-blue hover:bg-mint-light/40">{isImage ? <img src={value} alt={`${label} preview`} className="h-28 w-full rounded object-contain" /> : <i className="bi bi-file-earmark-pdf text-3xl" />}<span className="mt-2 block"><i className="bi bi-box-arrow-up-right" /> Open {label}</span></a>
}
