export type AppRole = 'customer' | 'pharmacy' | 'admin'

export interface CustomerSession {
  id?: string
  name: string
  email: string
  phone: string
  role: AppRole
}

const STORAGE_KEY = 'he_customer_session'
const USERS_STORAGE_KEY = 'he_registered_users'
type RegisteredUser = CustomerSession & { password: string }

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
  const registered = getRegisteredUsers().find((user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password && user.role === role)
  if (!match && !registered) return null

  const session: CustomerSession = {
    id: match?.email ?? registered?.id,
    name: match?.name ?? registered!.name,
    email: match?.email ?? registered!.email,
    phone: match?.phone ?? registered!.phone,
    role: match?.role ?? registered!.role,
  }

  setCustomerSession(session)
  return session
}

function getRegisteredUsers(): RegisteredUser[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(window.localStorage.getItem(USERS_STORAGE_KEY) ?? '[]') as RegisteredUser[] } catch { return [] }
}

export function registerUser(input: CustomerSession & { password: string }) {
  const users = getRegisteredUsers()
  if (users.some((user) => user.email.toLowerCase() === input.email.toLowerCase())) throw new Error('An account with this email already exists.')
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...users, input]))
  setCustomerSession(input)
}

export function getDemoUsers() {
  return DEMO_USERS.map(({ email, role }) => ({ email, role }))
}
