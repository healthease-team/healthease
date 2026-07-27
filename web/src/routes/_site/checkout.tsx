import { useState } from 'react'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import OrderSummary from '#/components/OrderSummary'
import CheckoutForm from '#/components/CheckoutForm'
import { useCart } from '#/lib/cart-context'
import { useToast } from '#/lib/toast-context'
import type { DeliveryMethod } from '#/lib/types'

export const Route = createFileRoute('/_site/checkout')({ component: CheckoutPage })

function CheckoutPage() {
  const { items, clearCart } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup')
  const [distanceKm, setDistanceKm] = useState<number | null>(null)
  const [placed, setPlaced] = useState(false)

  function handlePlaceOrder() {
    // TODO(phase-2): create real order in Supabase, redirect to Stripe Checkout, only mark placed on payment success
    clearCart()
    setPlaced(true)
    showToast('Order placed! We’ll be in touch shortly.')
  }

  if (placed) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <i className="bi bi-check-circle text-5xl text-accent-blue" />
        <h1 className="text-2xl font-bold text-brand-navy mt-4">Order placed successfully!</h1>
        <p className="text-text-muted mt-2">
          This is a mock confirmation — order history will appear on your Account page once accounts are wired up.
        </p>
        <button
          className="mt-6 text-link-blue hover:underline"
          onClick={() => navigate({ to: '/shop' })}
        >
          Continue shopping
        </button>
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
