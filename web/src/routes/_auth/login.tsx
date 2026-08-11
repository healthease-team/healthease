import { useState, type FormEvent } from 'react'
import { Link, useNavigate, createFileRoute } from '@tanstack/react-router'
import AuthCard from '#/components/AuthCard'
import Button from '#/components/ui/Button'
import { inputClass, labelClass } from '#/lib/ui-classes'
import { setCustomerSession, type AppRole } from '#/lib/customer-auth'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/_auth/login')({ component: LoginPage })

const QUICK_LOGINS: { label: string; role: AppRole; email: string; password: string }[] = [
  { label: 'Admin', role: 'admin', email: 'admin@healthease.com', password: 'admin123' },
  { label: 'Pharmacy', role: 'pharmacy', email: 'pharmacy@healthease.com', password: 'pharmacy123' },
  { label: 'Customer', role: 'customer', email: 'kiran@gmail.com', password: 'shanil123' },
]

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<AppRole>('customer')
  const [loading, setLoading] = useState(false)

  async function performLogin(loginEmail: string, loginPassword: string, loginRole: AppRole) {
    setLoading(true)

    const result = await authClient.signIn.email({ email: loginEmail, password: loginPassword })
    if (result.error || !result.data?.user) {
      window.alert(result.error?.message ?? 'Invalid email or password')
      setLoading(false)
      return
    }
    const user = result.data.user as typeof result.data.user & { role?: AppRole }
    if ((user.role ?? 'customer') !== loginRole) {
      await authClient.signOut()
      window.alert('This account does not have the selected role')
      setLoading(false)
      return
    }
    setCustomerSession({ id: user.id, name: user.name ?? 'Customer', email: user.email, phone: '+597 000 0000', role: user.role ?? 'customer' })

    if (loginRole === 'pharmacy') {
      navigate({ to: '/pharmacy/dashboard' })
    } else if (loginRole === 'admin') {
      navigate({ to: '/admin' })
    } else {
      navigate({ to: '/account' })
    }
    setLoading(false)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    await performLogin(email, password, role)
  }

  async function handleQuickLogin(ql: (typeof QUICK_LOGINS)[number]) {
    setEmail(ql.email)
    setPassword(ql.password)
    setRole(ql.role)
    await performLogin(ql.email, ql.password, ql.role)
  }

  return (
    <AuthCard title="Welcome back" subtitle="Log in to manage your orders">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Password</label>
          <input type="password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Account type</label>
          <select className={inputClass} value={role} onChange={(e) => setRole(e.target.value as AppRole)}>
            <option value="customer">Customer</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Logging in…' : 'Log In'}
        </Button>
        <div className="pt-2">
          {/* <p className="text-center text-xs text-text-muted mb-2">Quick login</p> */}
          <div className="flex gap-2">
            {QUICK_LOGINS.map((ql) => (
              <Button
                key={ql.role}
                type="button"
                variant="outline"
                className="flex-1"
                disabled={loading}
                onClick={() => handleQuickLogin(ql)}
              >
                {ql.label}
              </Button>
            ))}
          </div>
        </div>
      </form>
      <p className="text-center text-sm text-text-muted mt-5">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-link-blue hover:underline">
          Register
        </Link>
      </p>
    </AuthCard>
  )
}
