import { useState, type FormEvent } from 'react'
import { Link, useNavigate, createFileRoute } from '@tanstack/react-router'
import AuthCard from '#/components/AuthCard'
import Button from '#/components/ui/Button'
import { inputClass, labelClass } from '#/lib/ui-classes'
import { setCustomerSession, type AppRole } from '#/lib/customer-auth'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/_auth/register')({ component: RegisterPage })

function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const role: AppRole = 'customer'
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    const result = await authClient.signUp.email({ email, password, name, role })
    if (result.error || !result.data?.user) {
      window.alert(result.error?.message ?? 'Unable to create account')
      setLoading(false)
      return
    }
    const user = result.data.user as typeof result.data.user & { role?: AppRole }
    setCustomerSession({ id: user.id, name: user.name ?? name, email: user.email, phone: '+597 000 0000', role: user.role ?? role })

    navigate({ to: '/account' })
    setLoading(false)
  }

  return (
    <AuthCard title="Create an account" subtitle="Sign up for a customer account">
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
