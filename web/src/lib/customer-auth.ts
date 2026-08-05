export interface CustomerSession {
  name: string
  email: string
  phone: string
}

const STORAGE_KEY = 'he_customer_session'

export function getCustomerSession(): CustomerSession | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as CustomerSession
  } catch {
    return null
  }
}

export function setCustomerSession(session: CustomerSession) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearCustomerSession() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}

export function isCustomerLoggedIn() {
  return !!getCustomerSession()
}
