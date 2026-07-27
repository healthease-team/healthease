import { useCart } from '#/lib/cart-context'
import { ADMIN_FEE, PLATFORM_FEE, deliveryFee } from '#/lib/constants'

export default function OrderSummary({
  deliveryMethod,
  distanceKm,
}: {
  deliveryMethod: 'pickup' | 'delivery'
  distanceKm: number | null
}) {
  const { items, updateQuantity, removeItem, clearCart, bagTotal } = useCart()

  const fee = deliveryMethod === 'delivery' && distanceKm !== null ? deliveryFee(distanceKm) : 0
  const total = bagTotal + ADMIN_FEE + PLATFORM_FEE + fee

  return (
    <div className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-brand-navy">Order Summary</h2>
        {items.length > 0 && (
          <button className="text-sm text-link-blue hover:underline" onClick={clearCart}>
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-text-muted text-sm">Your cart is empty. Add products from the Shop to get started.</p>
      ) : (
        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              <div className="relative w-12 h-12 shrink-0">
                <img src={item.image} alt={item.name} className="absolute inset-0 h-full w-full object-contain rounded-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-brand-navy truncate">{item.name}</div>
                <div className="text-xs text-text-muted-2">SRD {item.price} each</div>
              </div>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                className="w-14 rounded-lg border border-brand-navy/15 bg-surface text-brand-navy px-2 py-1 text-sm text-center"
              />
              <button
                className="text-text-muted-2 hover:text-red-600"
                onClick={() => removeItem(item.productId)}
                aria-label={`Remove ${item.name}`}
              >
                <i className="bi bi-trash" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-brand-navy/10 pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-text-muted">
          <span>Bag Total</span>
          <span>SRD {bagTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-text-muted">
          <span>Admin Fee</span>
          <span>SRD {ADMIN_FEE.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-text-muted">
          <span>Platform Fee</span>
          <span>SRD {PLATFORM_FEE.toFixed(2)}</span>
        </div>
        {deliveryMethod === 'delivery' && (
          <div className="flex justify-between text-text-muted">
            <span>Delivery Fee</span>
            <span>{distanceKm !== null ? `SRD ${fee.toFixed(2)}` : 'Set your location'}</span>
          </div>
        )}
        <div className="flex justify-between text-brand-navy font-bold text-base pt-2 border-t border-brand-navy/10">
          <span>Total</span>
          <span>SRD {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
