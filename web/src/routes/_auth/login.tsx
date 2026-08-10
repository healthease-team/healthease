import { useState, type FormEvent } from 'react'
import { Link, useNavigate, createFileRoute } from '@tanstack/react-router'
import AuthCard from '#/components/AuthCard'
import Button from '#/components/ui/Button'
import { inputClass, labelClass } from '#/lib/ui-classes'
import { setCustomerSession, type AppRole } from '#/lib/customer-auth'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/_auth/login')({ component: LoginPage })

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<AppRole>('customer')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    const result = await authClient.signIn.email({ email, password })
    if (result.error || !result.data?.user) {
      window.alert(result.error?.message ?? 'Invalid email or password')
      setLoading(false)
      return
    }
    const user = result.data.user as typeof result.data.user & { role?: AppRole }
    if ((user.role ?? 'customer') !== role) {
      await authClient.signOut()
      window.alert('This account does not have the selected role')
      setLoading(false)
      return
    }
    setCustomerSession({ id: user.id, name: user.name ?? 'Customer', email: user.email, phone: '+597 000 0000', role: user.role ?? 'customer' })

    if (role === 'pharmacy') {
      navigate({ to: '/pharmacy/dashboard' })
    } else if (role === 'admin') {
      navigate({ to: '/admin' })
    } else {
      navigate({ to: '/account' })
    }
    setLoading(false)
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
