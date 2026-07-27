import { useState, type FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import Button from './ui/Button'
import { inputClass, labelClass } from '#/lib/ui-classes'
import { pharmacies } from '#/lib/mock-data'
import { haversineKm } from '#/lib/geo'
import { MAX_DELIVERY_DISTANCE_KM } from '#/lib/constants'
import type { DeliveryMethod } from '#/lib/types'

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
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [pharmacyId, setPharmacyId] = useState(pharmacies[0].id)
  const [prescription, setPrescription] = useState<File | null>(null)
  const [idCard, setIdCard] = useState<File | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [locating, setLocating] = useState(false)
  const [distanceError, setDistanceError] = useState<string | null>(null)

  function handleUseMyLocation() {
    if (!navigator.geolocation) return
    setLocating(true)
    setDistanceError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pharmacy = pharmacies.find((p) => p.id === pharmacyId) ?? pharmacies[0]
        const km = haversineKm(
          position.coords.latitude,
          position.coords.longitude,
          pharmacy.lat,
          pharmacy.lng
        )
        onDistanceChange(km)
        if (km > MAX_DELIVERY_DISTANCE_KM) {
          setDistanceError(`Delivery unavailable — you're ${km.toFixed(1)}km from the selected pharmacy (max ${MAX_DELIVERY_DISTANCE_KM}km).`)
        }
        setLocating(false)
      },
      () => {
        setLocating(false)
        setDistanceError('Could not get your location. Please allow location access and try again.')
      }
    )
  }

  const isValid =
    !cartIsEmpty &&
    name.trim() &&
    email.trim() &&
    phone.trim() &&
    prescription &&
    idCard &&
    termsAccepted &&
    (deliveryMethod === 'pickup' || (address.trim() && distanceKm !== null && distanceKm <= MAX_DELIVERY_DISTANCE_KM))

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isValid) return
    // TODO(phase-2): upload prescription/idCard to Supabase Storage, create order via Supabase, redirect to Stripe Checkout
    onPlaceOrder()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-5 space-y-5">
      <h2 className="text-lg font-bold text-brand-navy">Checkout Details</h2>

      <div className="flex rounded-full border-2 border-brand-navy overflow-hidden w-fit">
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

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Full Name</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} required />
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

      {deliveryMethod === 'delivery' && (
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Delivery Address</label>
            <input className={inputClass} value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
          <div className="rounded-xl border border-dashed border-brand-navy/25 bg-mint-light/40 h-40 flex flex-col items-center justify-center gap-2 text-text-muted-2 text-sm">
            <i className="bi bi-map text-2xl" />
            {/* TODO(phase-2): embed Leaflet map for pin-drop location picking */}
            <span>Map preview coming soon</span>
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={handleUseMyLocation} disabled={locating}>
              {locating ? 'Locating…' : 'Use My Location'}
            </Button>
            {distanceKm !== null && !distanceError && (
              <span className="text-sm text-text-muted">≈ {distanceKm.toFixed(1)}km away</span>
            )}
          </div>
          {distanceError && <p className="text-sm text-red-600">{distanceError}</p>}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Prescription (image or PDF)</label>
          <input
            type="file"
            accept="image/*,.pdf"
            className={inputClass}
            onChange={(e) => setPrescription(e.target.files?.[0] ?? null)}
            required
          />
        </div>
        <div>
          <label className={labelClass}>ID Card (image or PDF)</label>
          <input
            type="file"
            accept="image/*,.pdf"
            className={inputClass}
            onChange={(e) => setIdCard(e.target.files?.[0] ?? null)}
            required
          />
        </div>
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
