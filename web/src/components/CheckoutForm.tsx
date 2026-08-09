import { useEffect, useState, type FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import Button from './ui/Button'
import { inputClass, labelClass } from '#/lib/ui-classes'
import { pharmacies } from '#/lib/mock-data'
import { haversineKm } from '#/lib/geo'
import { ADMIN_FEE, MAX_DELIVERY_DISTANCE_KM, PLATFORM_FEE, deliveryFee } from '#/lib/constants'
import type { DeliveryMethod } from '#/lib/types'
import { getCustomerSession } from '#/lib/customer-auth'
import { useCart } from '#/lib/cart-context'
import { useToast } from '#/lib/toast-context'
import { getCheckoutDraft, saveCheckoutDraft } from '#/lib/checkout-draft'

const paymentMethods = ['cash', 'card'] as const

interface CheckoutFormProps {
  deliveryMethod: DeliveryMethod
  onDeliveryMethodChange: (method: DeliveryMethod) => void
  distanceKm: number | null
  onDistanceChange: (km: number | null) => void
  onPlaceOrder: () => void
  cartIsEmpty: boolean
}

export default function CheckoutForm({
  deliveryMethod,
  onDeliveryMethodChange,
  distanceKm,
  onDistanceChange,
  onPlaceOrder,
  cartIsEmpty,
}: CheckoutFormProps) {
  const draft = getCheckoutDraft()
  const session = getCustomerSession()
  const { bagTotal, items } = useCart()
  const { showToast } = useToast()
  const [name, setName] = useState(draft.name ?? session?.name ?? '')
  const [email, setEmail] = useState(draft.email ?? session?.email ?? '')
  const [phone, setPhone] = useState(draft.phone ?? session?.phone ?? '')
  const [billingAddress, setBillingAddress] = useState(draft.billingAddress ?? '')
  const [deliveryAddress, setDeliveryAddress] = useState(draft.deliveryAddress ?? '')
  const [sameAsBilling, setSameAsBilling] = useState(draft.sameAsBilling ?? true)
  const [useExactLocation, setUseExactLocation] = useState(draft.useExactLocation ?? false)
  const [paymentMethod, setPaymentMethod] = useState<(typeof paymentMethods)[number]>(draft.paymentMethod ?? 'cash')
  const [cashAmount, setCashAmount] = useState(draft.cashAmount ?? '')
  const [pharmacyId, setPharmacyId] = useState(draft.pharmacyId ?? pharmacies[0].id)
  const [prescription, setPrescription] = useState<File | null>(draft.prescription ?? null)
  const [idCard, setIdCard] = useState<File | null>(draft.idCard ?? null)
  const [termsAccepted, setTermsAccepted] = useState(draft.termsAccepted ?? false)
  const [locating, setLocating] = useState(false)
  const [distanceError, setDistanceError] = useState<string | null>(null)
  const [customerLocation, setCustomerLocation] = useState<{ lat: number; lng: number } | null>(draft.customerLocation ?? null)
  const [deliveryNotes, setDeliveryNotes] = useState(draft.deliveryNotes ?? '')

  useEffect(() => { saveCheckoutDraft({ name, email, phone, billingAddress, deliveryAddress, sameAsBilling, useExactLocation, paymentMethod, cashAmount, pharmacyId, prescription, idCard, termsAccepted, distanceKm, customerLocation, deliveryNotes, deliveryMethod }) }, [name, email, phone, billingAddress, deliveryAddress, sameAsBilling, useExactLocation, paymentMethod, cashAmount, pharmacyId, prescription, idCard, termsAccepted, distanceKm, customerLocation, deliveryNotes, deliveryMethod])

  async function fileToDataUrl(file: File | null) {
    if (!file) return null
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const mapCenter = customerLocation ?? pharmacies.find((pharmacy) => pharmacy.id === pharmacyId) ?? pharmacies[0]
  const mapPreviewUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lng - 0.01}%2C${mapCenter.lat - 0.01}%2C${mapCenter.lng + 0.01}%2C${mapCenter.lat + 0.01}&layer=mapnik&marker=${mapCenter.lat}%2C${mapCenter.lng}`

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setDistanceError('Location is not supported by this browser. Enter your delivery address instead.')
      return
    }
    setLocating(true)
    setDistanceError(null)
    let finished = false
    const timeout = window.setTimeout(() => {
      if (!finished) {
        finished = true
        setLocating(false)
        setDistanceError('Location request timed out. Please check your browser permission and try again.')
      }
    }, 12000)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (finished) return
        finished = true
        window.clearTimeout(timeout)
        const pharmacy = pharmacies.find((p) => p.id === pharmacyId) ?? pharmacies[0]
        const km = haversineKm(
          position.coords.latitude,
          position.coords.longitude,
          pharmacy.lat,
          pharmacy.lng
        )
        setCustomerLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
        onDistanceChange(km)
        if (km > MAX_DELIVERY_DISTANCE_KM) {
          setDistanceError(`Delivery unavailable — you're ${km.toFixed(1)}km from the selected pharmacy (max ${MAX_DELIVERY_DISTANCE_KM}km).`)
        }
        setLocating(false)
      },
      (error) => {
        if (finished) return
        finished = true
        window.clearTimeout(timeout)
        setLocating(false)
        setDistanceError(error.code === error.TIMEOUT ? 'Location request timed out. Please try again.' : 'Could not get your location. Please allow location access and try again.')
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    )
  }

  const fee = deliveryMethod === 'delivery' && distanceKm !== null ? deliveryFee(distanceKm) : 0
  const vat = (bagTotal + ADMIN_FEE + PLATFORM_FEE + fee) * 0.1
  const totalDue = bagTotal + ADMIN_FEE + PLATFORM_FEE + fee + vat

  const isValid =
    !cartIsEmpty &&
    name.trim() &&
    email.trim() &&
    phone.trim() &&
    prescription &&
    idCard &&
    termsAccepted &&
    (deliveryMethod === 'pickup' || (billingAddress.trim() && (sameAsBilling ? deliveryAddress.trim() || true : deliveryAddress.trim()) && distanceKm !== null && distanceKm <= MAX_DELIVERY_DISTANCE_KM)) &&
    (paymentMethod === 'card' || Number(cashAmount || 0) >= totalDue)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (paymentMethod === 'cash' && Number(cashAmount || 0) < totalDue) {
      showToast(`Cash amount must be at least SRD ${totalDue.toFixed(2)}`)
      return
    }

    if (!isValid) return

    try {
      const [prescriptionPath, idCardPath] = await Promise.all([fileToDataUrl(prescription), fileToDataUrl(idCard)])
      const response = await fetch('/api/db/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: session?.email ?? 'guest@example.com',
          pharmacyId,
          customerName: name,
          email,
          phone,
          deliveryMethod,
          deliveryAddress: deliveryMethod === 'delivery' ? (sameAsBilling ? billingAddress : deliveryAddress) : null,
          deliveryNotes,
          customerLat: customerLocation?.lat ?? null,
          customerLng: customerLocation?.lng ?? null,
          distanceKm: distanceKm ?? null,
          prescriptionPath,
          idCardPath,
          bagTotal,
          adminFee: ADMIN_FEE,
          platformFee: PLATFORM_FEE,
          deliveryFee: fee,
          totalAmount: totalDue,
          items: items.map((item) => ({ productId: item.productId, productName: item.name, unitPrice: item.price, quantity: item.quantity })),
        }),
      })

      if (!response.ok) {
        throw new Error('Unable to place order')
      }

      onPlaceOrder()
    } catch {
      window.alert('We could not save your order right now. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-5 space-y-5">
      <h2 className="text-lg font-bold text-brand-navy">Checkout Details</h2>

      <div className="rounded-2xl border border-brand-navy/10 bg-mint-light/30 p-4">
        <h3 className="text-base font-semibold text-brand-navy">Contact information</h3>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClass}>Prescription <span className="text-red-500">*</span></label>
            <input
              type="file"
              accept="image/*,.pdf"
              className={inputClass}
              onChange={(e) => setPrescription(e.target.files?.[0] ?? null)}
            />
            {prescription && <p className="mt-1 text-xs text-text-muted"><i className="bi bi-file-earmark-check" /> {prescription.name}</p>}
          </div>
          <div>
            <label className={labelClass}>ID Card <span className="text-red-500">*</span></label>
            <input
              type="file"
              accept="image/*,.pdf"
              className={inputClass}
              onChange={(e) => setIdCard(e.target.files?.[0] ?? null)}
            />
            {idCard && <p className="mt-1 text-xs text-text-muted"><i className="bi bi-file-earmark-check" /> {idCard.name}</p>}
          </div>
          <div>
            <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Email <span className="text-red-500">*</span></label>
            <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Phone <span className="text-red-500">*</span></label>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              className={inputClass}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Pharmacy</label>
            <select
              className={inputClass}
              value={pharmacyId}
              onChange={(e) => {
                setPharmacyId(e.target.value)
                onDistanceChange(null)
              }}
            >
              {pharmacies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.address}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-navy/10 bg-surface p-4">
        <h3 className="text-base font-semibold text-brand-navy">Order type</h3>
        <div className="flex rounded-full border-2 border-brand-navy overflow-hidden w-fit mt-3">
          {(['pickup', 'delivery'] as DeliveryMethod[]).map((method) => (
            <button
              key={method}
              type="button"
              className={`px-5 py-2 text-sm font-semibold capitalize transition-colors ${
                deliveryMethod === method ? 'bg-brand-navy text-white dark:text-slate-900' : 'bg-surface text-brand-navy'
              }`}
              onClick={() => onDeliveryMethodChange(method)}
            >
              {method}
            </button>
          ))}
        </div>

        {deliveryMethod === 'pickup' && (
          <div className="mt-4 rounded-2xl border border-brand-navy/10 p-4 bg-mint-light/30">
            <p className="text-sm text-text-muted">Pickup is available from the selected pharmacy. Please collect your order when notified.</p>
          </div>
        )}

        {deliveryMethod === 'delivery' && (
          <div className="mt-4 space-y-4 rounded-2xl border border-brand-navy/10 p-4 bg-mint-light/30">
            <div>
              <label className={labelClass}>Billing address</label>
              <input className={inputClass} value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} required />
            </div>
            <label className="flex items-center gap-2 text-sm text-text-muted">
              <input type="checkbox" checked={sameAsBilling} onChange={(e) => setSameAsBilling(e.target.checked)} />
              Same as billing address
            </label>
            <div>
              <label className={labelClass}>Delivery address</label>
              <input className={inputClass} value={sameAsBilling ? billingAddress : deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} disabled={sameAsBilling} />
            </div>
            <label className="flex items-center gap-2 text-sm text-text-muted">
              <input type="checkbox" checked={useExactLocation} onChange={(e) => { setUseExactLocation(e.target.checked); if (e.target.checked) handleUseMyLocation() }} />
              Use my exact location
            </label>
            <div className="rounded-xl border border-dashed border-brand-navy/25 bg-surface/70 h-48 overflow-hidden">
              <iframe title="Delivery map preview" src={mapPreviewUrl} className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" onClick={handleUseMyLocation} disabled={locating}>
                {locating ? 'Locating…' : 'Use My Location'}
              </Button>
              {distanceKm !== null && !distanceError && (
                <span className="text-sm text-text-muted">≈ {distanceKm.toFixed(1)}km away</span>
              )}
            </div>
            <div>
              <label className={labelClass}>Delivery notes</label>
              <textarea
                className={`${inputClass} min-h-[72px] resize-none`}
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="e.g. where to park"
              />
            </div>
            {distanceError && <p className="text-sm text-red-600">{distanceError}</p>}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-brand-navy/10 bg-surface p-4">
        <h3 className="text-base font-semibold text-brand-navy">Payment method</h3>
        <div className="flex gap-3 mt-3">
          {paymentMethods.map((method) => (
            <button
              key={method}
              type="button"
              className={`rounded-full border px-4 py-2 text-sm font-semibold capitalize ${paymentMethod === method ? 'bg-brand-navy text-white' : 'border-brand-navy/15 text-brand-navy'}`}
              onClick={() => setPaymentMethod(method)}
            >
              {method}
            </button>
          ))}
        </div>
        {paymentMethod === 'cash' && (
          <div className="mt-4">
            <label className={labelClass}>Amount paid</label>
            <input type="number" min="0" className={inputClass} value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} placeholder="Enter amount" />
            <p className="text-xs text-text-muted mt-2">For delivery orders, the amount entered should be equal to or greater than the total due.</p>
          </div>
        )}
        {paymentMethod === 'card' && <p className="text-sm text-text-muted mt-3">Card payment will be handled securely after confirming your order.</p>}
      </div>

      <label className="flex items-center gap-2 text-sm text-text-muted">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
        />
        I agree to the{' '}
        <Link to="/terms" className="text-link-blue hover:underline">
          Terms &amp; Conditions
        </Link>
      </label>

      <Button type="submit" variant="primary" className="w-full" disabled={!isValid}>
        Place Order
      </Button>
    </form>
  )
}
