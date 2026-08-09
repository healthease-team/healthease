import { useEffect, useState } from 'react'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import OrderSummary from '#/components/OrderSummary'
import CheckoutForm from '#/components/CheckoutForm'
import { useCart } from '#/lib/cart-context'
import { useToast } from '#/lib/toast-context'
import type { DeliveryMethod } from '#/lib/types'
import { clearCheckoutDraft, getCheckoutDraft, saveCheckoutDraft } from '#/lib/checkout-draft'

export const Route = createFileRoute('/_site/checkout')({ component: CheckoutPage })

function CheckoutPage() {
  const { items, clearCart } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(() => getCheckoutDraft().deliveryMethod ?? 'pickup')
  const [distanceKm, setDistanceKm] = useState<number | null>(() => getCheckoutDraft().distanceKm ?? null)
  const [placed, setPlaced] = useState(false)

  useEffect(() => { saveCheckoutDraft({ ...getCheckoutDraft(), deliveryMethod, distanceKm }) }, [deliveryMethod, distanceKm])

  function handlePlaceOrder() {
    clearCart()
    clearCheckoutDraft()
    setPlaced(true)
    showToast('Order placed! We’ll be in touch shortly.')
  }

  if (placed) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <i className="bi bi-check-circle text-5xl text-accent-blue" />
        <h1 className="text-2xl font-bold text-brand-navy mt-4">Order placed successfully!</h1>
        <p className="text-text-muted mt-2">
          Your order has been sent to the selected pharmacy. You can view its status, documents, and delivery or pickup details in My Orders.
        </p>
        <button
          className="mt-6 text-link-blue hover:underline"
          onClick={() => navigate({ to: '/shop' })}
        >
          Continue shopping
        </button>
        <button className="ml-5 mt-6 text-link-blue hover:underline" onClick={() => navigate({ to: '/account' })}>View My Orders</button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-navy mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <OrderSummary deliveryMethod={deliveryMethod} distanceKm={distanceKm} />
        <CheckoutForm
          deliveryMethod={deliveryMethod}
          onDeliveryMethodChange={setDeliveryMethod}
          distanceKm={distanceKm}
          onDistanceChange={setDistanceKm}
          onPlaceOrder={handlePlaceOrder}
          cartIsEmpty={items.length === 0}
        />
      </div>
    </div>
  )
}
