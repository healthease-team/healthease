export type AppRole = 'customer' | 'pharmacy' | 'admin'

export interface CustomerSession {
  id?: string
  name: string
  email: string
  phone: string
  role: AppRole
}

const STORAGE_KEY = 'he_customer_session'

const DEMO_USERS: Array<{ email: string; password: string; role: AppRole; name: string; phone: string }> = [
  { email: 'customer@healthease.com', password: 'customer123', role: 'customer', name: 'Denver', phone: '+597 123 4567' },
  { email: 'pharmacy@healthease.com', password: 'pharmacy123', role: 'pharmacy', name: 'Rina Pharmacy', phone: '+597 987 6543' },
  { email: 'admin@healthease.com', password: 'admin123', role: 'admin', name: 'Admin Team', phone: '+597 555 0101' },
]

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

export function signInUser(email: string, password: string, role: AppRole) {
  const match = DEMO_USERS.find((user) => user.email === email && user.password === password && user.role === role)
  if (!match) return null

  const session: CustomerSession = {
    id: match.email,
    name: match.name,
    email: match.email,
    phone: match.phone,
    role: match.role,
  }

  setCustomerSession(session)
  return session
}

export function getDemoUsers() {
  return DEMO_USERS.map(({ email, role }) => ({ email, role }))
}
