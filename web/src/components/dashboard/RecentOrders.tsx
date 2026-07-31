import { useState } from 'react'
import StatusBadge from '../ui/StatusBadge'
import OrderDocsModal from './OrderDocsModal'
import OrderDetailsModal from './OrderDetailsModal'
import { useDashboardData } from '#/lib/dashboard-context'
import { ORDER_STATUS_META, ORDER_STATUS_NEXT } from '#/lib/constants'
import type { Order, OrderStatus } from '#/lib/types'

const FILTERS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Ready for Delivery', value: 'ready_for_delivery' },
  { label: 'On Its Way', value: 'on_its_way' },
  { label: 'Ready for Pickup', value: 'ready_for_pickup' },
]

export default function RecentOrders() {
  const { orders, updateOrderStatus } = useDashboardData()
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [docsOrder, setDocsOrder] = useState<Order | null>(null)
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null)

  const visibleOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-5">
      <h2 className="text-lg font-bold text-brand-navy mb-4">Recent Orders</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f.value ? 'bg-brand-navy text-white dark:text-slate-900' : 'bg-mint-light text-brand-navy hover:bg-mint'
            }`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {visibleOrders.length === 0 && <p className="text-text-muted-2 text-sm py-4">No orders in this filter.</p>}
        {visibleOrders.map((order) => {
          const nextStatus = ORDER_STATUS_NEXT[order.status]
          return (
            <div key={order.id} className="border border-brand-navy/10 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold text-brand-navy">Order #{order.id}</div>
                  <div className="text-xs text-text-muted-2">{order.customerName}</div>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  className="text-xs px-3 py-1.5 rounded-full border border-brand-navy/15 text-brand-navy hover:bg-mint-light"
                  onClick={() => setDocsOrder(order)}
                >
                  Docs
                </button>
                {order.deliveryMethod === 'delivery' && (
                  <button
                    className="text-xs px-3 py-1.5 rounded-full border border-brand-navy/15 text-brand-navy hover:bg-mint-light"
                    onClick={() => setDetailsOrder(order)}
                  >
                    Details
                  </button>
                )}
                {nextStatus && (
                  <button
                    className="text-xs px-3 py-1.5 rounded-full bg-accent-blue text-white hover:bg-brand-navy transition-colors"
                    onClick={() => updateOrderStatus(order.id, nextStatus)}
                  >
                    Mark as {ORDER_STATUS_META[nextStatus].label}
                  </button>
                )}
                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                  <button
                    className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <OrderDocsModal order={docsOrder} onClose={() => setDocsOrder(null)} />
      <OrderDetailsModal order={detailsOrder} onClose={() => setDetailsOrder(null)} />
    </div>
  )
}
