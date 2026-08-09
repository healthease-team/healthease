import { useState, type FormEvent } from 'react'
import { Link, useNavigate, createFileRoute } from '@tanstack/react-router'
import AuthCard from '#/components/AuthCard'
import Button from '#/components/ui/Button'
import { inputClass, labelClass } from '#/lib/ui-classes'
import { registerUser, type AppRole } from '#/lib/customer-auth'

export const Route = createFileRoute('/_auth/register')({ component: RegisterPage })

function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<AppRole>('customer')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      registerUser({ id: email, name, email, phone: '+597 000 0000', role, password })
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to create account')
      setLoading(false)
      return
    }

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
    <AuthCard title="Create an account" subtitle="Choose the account type that fits your role">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Full name</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
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
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      <p className="text-center text-sm text-text-muted mt-5">
        Already have an account?{' '}
        <Link to="/login" className="text-link-blue hover:underline">
          Log in
        </Link>
      </p>
    </AuthCard>
  )
}
