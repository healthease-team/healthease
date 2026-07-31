import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import Button from '../ui/Button'
import ThemeToggle from '../ui/ThemeToggle'
import NewItemModal from './NewItemModal'
import { useDashboardData } from '#/lib/dashboard-context'

export default function DashboardHeader() {
  const navigate = useNavigate()
  const { searchTerm, setSearchTerm } = useDashboardData()
  const [newItemOpen, setNewItemOpen] = useState(false)

  return (
    <header className="bg-surface shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold">
            H
          </span>
          <span className="text-xl font-extrabold text-brand-navy hidden sm:inline">
            Health<span className="text-accent-blue">Ease</span>
          </span>
        </Link>
        <input
          type="search"
          placeholder="Search products…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 max-w-sm rounded-full border border-brand-navy/15 bg-surface text-brand-navy px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
        />
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="primary" className="!px-4 !py-2 text-sm" onClick={() => setNewItemOpen(true)}>
            <i className="bi bi-plus-lg" /> New Item
          </Button>
          <ThemeToggle />
          <button
            className="text-text-muted-2 hover:text-brand-navy text-sm font-medium"
            onClick={() => navigate({ to: '/login' })}
          >
            Logout
          </button>
        </div>
      </div>
      <NewItemModal open={newItemOpen} onClose={() => setNewItemOpen(false)} />
    </header>
  )
}
