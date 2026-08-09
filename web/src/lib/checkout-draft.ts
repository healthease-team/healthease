import type { DeliveryMethod } from './types'

export interface CheckoutDraft {
  name?: string; email?: string; phone?: string; billingAddress?: string; deliveryAddress?: string
  sameAsBilling?: boolean; useExactLocation?: boolean; paymentMethod?: 'cash' | 'card'; cashAmount?: string
  pharmacyId?: string; prescription?: File | null; idCard?: File | null; termsAccepted?: boolean
  distanceKm?: number | null; customerLocation?: { lat: number; lng: number } | null; deliveryNotes?: string
  deliveryMethod?: DeliveryMethod
}

let draft: CheckoutDraft = {}

export function getCheckoutDraft() { return draft }
export function saveCheckoutDraft(next: CheckoutDraft) { draft = next }
export function clearCheckoutDraft() { draft = {} }
