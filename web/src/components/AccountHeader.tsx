import { Link, useNavigate } from '@tanstack/react-router'
import ThemeToggle from './ui/ThemeToggle'
import { clearCustomerSession } from '#/lib/customer-auth'

export default function AccountHeader() {
  const navigate = useNavigate()

  return (
    <header className="bg-surface shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold">
            H
          </span>
          <span className="text-xl font-extrabold text-brand-navy">
            Health<span className="text-accent-blue">Ease</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/shop" className="text-sm font-semibold text-link-blue hover:underline">Back to shop</Link>
          <span className="text-brand-navy text-sm font-semibold hidden sm:inline">Customer</span>
          <ThemeToggle />
          <button
            className="text-text-muted-2 hover:text-brand-navy text-sm font-medium"
            onClick={() => { clearCustomerSession(); navigate({ to: '/login' }) }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
