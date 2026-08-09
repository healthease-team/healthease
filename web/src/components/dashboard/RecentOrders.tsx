import { useState } from 'react'
import StatusBadge from '../ui/StatusBadge'
import OrderDetailsModal from './OrderDetailsModal'
import { useDashboardData } from '#/lib/dashboard-context'
import { ORDER_STATUS_META, pharmacyStatusOptions } from '#/lib/constants'
import type { Order, OrderStatus } from '#/lib/types'

export default function RecentOrders() {
  const { orders, updateOrderStatus } = useDashboardData()
  const [deliveryFilter, setDeliveryFilter] = useState<OrderStatus | 'all'>('all')
  const [pickupFilter, setPickupFilter] = useState<OrderStatus | 'all'>('all')
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null)

  const visibleOrders = orders.filter((order) => {
    const filter = order.deliveryMethod === 'delivery' ? deliveryFilter : pickupFilter
    return filter === 'all' || order.status === filter
  })

  return (
    <div className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-5">
      <h2 className="text-lg font-bold text-brand-navy mb-4">Recent Orders</h2>

      <div className="grid sm:grid-cols-2 gap-3 mb-4 text-sm">
        <label className="text-brand-navy font-medium">Delivery
          <select className="mt-1 w-full rounded-lg border border-brand-navy/15 p-2 bg-surface" value={deliveryFilter} onChange={(e) => setDeliveryFilter(e.target.value as OrderStatus | 'all')}>
            <option value="all">All</option><option value="pending">Pending</option><option value="ready_for_delivery">Ready for delivery</option><option value="on_its_way">On its way</option>
          </select>
        </label>
        <label className="text-brand-navy font-medium">Pickup
          <select className="mt-1 w-full rounded-lg border border-brand-navy/15 p-2 bg-surface" value={pickupFilter} onChange={(e) => setPickupFilter(e.target.value as OrderStatus | 'all')}>
            <option value="all">All</option><option value="pending">Pending</option><option value="ready_for_pickup">Ready for pickup</option>
          </select>
        </label>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {visibleOrders.length === 0 && <p className="text-text-muted-2 text-sm py-4">No orders in this filter.</p>}
        {visibleOrders.map((order) => {
          const options = pharmacyStatusOptions(order.deliveryMethod, order.status)
          return (
            <div key={order.id} className="border border-brand-navy/10 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold text-brand-navy">{order.deliveryMethod === 'delivery' ? <i className="bi bi-truck mr-1" title="Delivery order" /> : <i className="bi bi-bag-check mr-1" title="Pickup order" />}Order #{order.id.slice(-8)}</div>
                  <div className="text-xs text-text-muted-2">{order.customerName}</div>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <button className="text-xs px-3 py-1.5 rounded-full border border-brand-navy/15 text-brand-navy hover:bg-mint-light" onClick={() => setDetailsOrder(order)}><i className="bi bi-info-circle" /> Details</button>
                {options.map((status) => <button key={status} className={status === 'cancelled' ? 'text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-600' : 'text-xs px-3 py-1.5 rounded-full bg-accent-blue text-white hover:bg-brand-navy'} onClick={() => void updateOrderStatus(order.id, status)}>{status === 'cancelled' ? 'Cancel' : ORDER_STATUS_META[status].label}</button>)}
              </div>
            </div>
          )
        })}
      </div>

      <OrderDetailsModal order={detailsOrder} onClose={() => setDetailsOrder(null)} />
    </div>
  )
}
