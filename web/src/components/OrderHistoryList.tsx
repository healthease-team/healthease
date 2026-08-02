import { useState } from 'react'
import StatusBadge from './ui/StatusBadge'
import Button from './ui/Button'
import { orders as mockOrders } from '#/lib/mock-data'
import { useToast } from '#/lib/toast-context'
import type { Order } from '#/lib/types'

export default function OrderHistoryList() {
  const [orders, setOrders] = useState<Order[]>(mockOrders.filter((o) => o.customerId === 'demo-customer'))
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { showToast } = useToast()

  function cancelOrder(id: string) {
    // TODO(phase-2): PATCH order status via Supabase, enforced by RLS check constraint
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'cancelled' } : o)))
    showToast('Order cancelled')
  }

  if (orders.length === 0) {
    return <p className="text-text-muted">You haven&apos;t placed any orders yet.</p>
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const isExpanded = expandedId === order.id
        const canCancel = order.status !== 'delivered' && order.status !== 'cancelled'
        return (
          <div key={order.id} className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-4">
            <button
              className="w-full flex items-center justify-between gap-3 text-left"
              onClick={() => setExpandedId(isExpanded ? null : order.id)}
            >
              <div>
                <div className="font-semibold text-brand-navy">Order #{order.id}</div>
                <div className="text-xs text-text-muted-2">{order.createdAt}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-mint-light text-brand-navy capitalize">
                  {order.deliveryMethod}
                </span>
                <StatusBadge status={order.status} />
                <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'} text-brand-navy`} />
              </div>
            </button>

            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-brand-navy/10 space-y-3 animate-fade-in-up">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-text-muted">
                    <span>{item.productName} × {item.quantity}</span>
                    <span>SRD {(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-semibold text-brand-navy pt-2 border-t border-brand-navy/10">
                  <span>Total</span>
                  <span>SRD {order.totalAmount.toFixed(2)}</span>
                </div>
                {canCancel && (
                  <Button variant="outline" className="!py-1.5 !px-4 text-sm" onClick={() => cancelOrder(order.id)}>
                    Cancel Order
                  </Button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
