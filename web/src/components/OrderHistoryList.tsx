import { useEffect, useState } from 'react'
import StatusBadge from './ui/StatusBadge'
import Button from './ui/Button'
import { useToast } from '#/lib/toast-context'
import { getCustomerSession } from '#/lib/customer-auth'
import type { Order } from '#/lib/types'

export default function OrderHistoryList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()
  const session = getCustomerSession()

  useEffect(() => {
    if (!session?.email) return
    fetch(`/api/db/orders?email=${encodeURIComponent(session.email)}`)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: Order[]) => setOrders(data))
      .catch(() => showToast('We could not load your orders.'))
      .finally(() => setLoading(false))
  }, [session?.email, showToast])

  async function cancelOrder(id: string) {
    const response = await fetch('/api/db/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: id, status: 'cancelled' }) })
    if (!response.ok) { showToast('Unable to cancel this order.'); return }
    const updated = await response.json() as Order
    setOrders((current) => current.map((order) => order.id === id ? updated : order))
    showToast('Order cancelled')
  }

  if (loading) return <p className="text-text-muted">Loading your orders…</p>
  if (!orders.length) return <p className="text-text-muted">You haven&apos;t placed any orders yet.</p>

  return <div className="space-y-4">{orders.map((order) => {
    const expanded = expandedId === order.id
    return <div key={order.id} className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-4">
      <button className="w-full flex items-center justify-between gap-3 text-left" onClick={() => setExpandedId(expanded ? null : order.id)}>
        <div><div className="font-semibold text-brand-navy" title={order.id}>Order #{order.id.slice(-8)}</div><div className="text-xs text-text-muted-2">{new Date(order.createdAt).toLocaleString()}</div></div>
        <div className="flex items-center gap-2"><span className="text-xs px-2 py-1 rounded-full bg-mint-light text-brand-navy capitalize">{order.deliveryMethod}</span><StatusBadge status={order.status} /><i className={`bi ${expanded ? 'bi-chevron-up' : 'bi-chevron-down'} text-brand-navy`} /></div>
      </button>
      {expanded && <div className="mt-4 pt-4 border-t border-brand-navy/10 space-y-3 animate-fade-in-up text-sm">
        <div className="rounded-xl bg-mint-light/40 p-3 text-text-muted"><span className="font-semibold text-brand-navy">{order.deliveryMethod === 'delivery' ? 'Delivery address' : 'Pickup'}:</span> {order.deliveryMethod === 'delivery' ? order.deliveryAddress || 'Not provided' : 'Collect from your selected pharmacy'}{order.deliveryNotes && <div className="mt-1"><span className="font-semibold text-brand-navy">Notes:</span> {order.deliveryNotes}</div>}</div>
        {order.items.map((item) => <div key={item.id} className="flex justify-between text-text-muted"><span>{item.productName} × {item.quantity}</span><span>SRD {(item.unitPrice * item.quantity).toFixed(2)}</span></div>)}
        <div className="grid grid-cols-2 gap-3"><DocumentLink label="Prescription" value={order.prescriptionPath} /><DocumentLink label="ID card" value={order.idCardPath} /></div>
        <div className="flex justify-between font-semibold text-brand-navy pt-2 border-t border-brand-navy/10"><span>Total</span><span>SRD {order.totalAmount.toFixed(2)}</span></div>
        {order.status === 'pending' && <Button variant="outline" className="!py-1.5 !px-4 text-sm" onClick={() => void cancelOrder(order.id)}>Cancel Order</Button>}
      </div>}
    </div>
  })}</div>
}

function DocumentLink({ label, value }: { label: string; value?: string }) {
  if (!value) return <div className="rounded-xl border border-dashed border-brand-navy/20 p-3 text-text-muted-2">{label}: unavailable</div>
  return <a href={value} target="_blank" rel="noreferrer" download={`${label.toLowerCase().replace(' ', '-')}-document`} className="rounded-xl border border-brand-navy/15 p-3 text-link-blue hover:underline"><i className="bi bi-file-earmark-arrow-down text-lg" /> <span className="ml-1">Open {label}</span></a>
}
