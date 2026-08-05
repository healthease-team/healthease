import { Link, useNavigate } from '@tanstack/react-router'
import ThemeToggle from './ui/ThemeToggle'

export default function AdminHeader() {
  const navigate = useNavigate()

  return (
    <header className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold">
            H
          </span>
          <span className="text-xl font-extrabold">
            HealthEase <span className="text-accent-blue font-medium text-sm align-middle">Admin</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/80 hidden sm:inline">Pharmacy account</span>
          <ThemeToggle className="!text-white hover:!bg-white/10" />
          <button className="text-white/70 hover:text-white text-sm font-medium" onClick={() => navigate({ to: '/login' })}>
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
