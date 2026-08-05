import { useState, type FormEvent } from 'react'
import { Link, useNavigate, createFileRoute } from '@tanstack/react-router'
import AuthCard from '#/components/AuthCard'
import Button from '#/components/ui/Button'
import { inputClass, labelClass } from '#/lib/ui-classes'
import { setCustomerSession } from '#/lib/customer-auth'

export const Route = createFileRoute('/_auth/login')({ component: LoginPage })

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setCustomerSession({ name: 'Denver', email, phone: '+597 123 4567' })
      navigate({ to: '/account' })
    }, 600)
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
      <p className="text-center text-sm text-text-muted mt-1">
        Own a pharmacy?{' '}
        <Link to="/register/pharmacy" className="text-link-blue hover:underline">
          Register your pharmacy
        </Link>
      </p>
    </AuthCard>
  )
}
