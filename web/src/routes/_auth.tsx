import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import ThemeToggle from '#/components/ui/ThemeToggle'

export const Route = createFileRoute('/_auth')({ component: AuthLayout })

function AuthLayout() {
  return (
    <div className="min-h-screen bg-mint flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <span className="w-9 h-9 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold">
            H
          </span>
          <span className="text-2xl font-extrabold text-brand-navy">
            Health<span className="text-accent-blue">Ease</span>
          </span>
        </Link>
        <Outlet />
      </div>
    </div>
  )
}
