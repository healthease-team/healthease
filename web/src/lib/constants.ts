import type { DeliveryMethod, OrderStatus } from './types'

export const ADMIN_FEE = 30
export const PLATFORM_FEE = 50
export const MAX_DELIVERY_DISTANCE_KM = 15

export function deliveryFee(distanceKm: number): number {
  return Math.max(100, 10 * distanceKm)
}

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  accepted: { label: 'Accepted', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
  ready_for_delivery: { label: 'Ready for Delivery', className: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300' },
  ready_for_pickup: { label: 'Ready for Pickup', className: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300' },
  on_its_way: { label: 'On Its Way', className: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300' },
  delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300' },
}

export const DELIVERY_STATUS_OPTIONS: OrderStatus[] = ['accepted', 'ready_for_delivery', 'on_its_way', 'cancelled']
export const PICKUP_STATUS_OPTIONS: OrderStatus[] = ['accepted', 'ready_for_pickup', 'cancelled']

export function pharmacyStatusOptions(method: DeliveryMethod, current: OrderStatus): OrderStatus[] {
  if (current === 'delivered' || current === 'cancelled') return []
  const options = method === 'delivery' ? DELIVERY_STATUS_OPTIONS : PICKUP_STATUS_OPTIONS
  return options.filter((s) => s !== current)
}

export function customerCanCancel(status: OrderStatus): boolean {
  return status === 'pending'
}

export const ESSENTIALS_TAG_LABELS: Record<string, string> = {
  morning: 'Morning Essentials',
  'on-the-go': 'On the Go',
  night: 'Night Care',
  travel: 'Travel Kit',
  office: 'Office Care',
  sports: 'Sports',
}
