import { ORDER_STATUS_META } from '#/lib/constants'
import type { OrderStatus } from '#/lib/types'

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS_META[status]
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${meta.className}`}>
      {meta.label}
    </span>
  )
}
