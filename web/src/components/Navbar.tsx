import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import Button from './ui/Button'
import ThemeToggle from './ui/ThemeToggle'
import { useCart } from '#/lib/cart-context'
import { useLocationsModal } from '#/lib/locations-modal-context'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/essentials', label: 'Essentials' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/contact', label: 'Contact' },
] as const

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { itemCount } = useCart()
  const { open: openLocations } = useLocationsModal()

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <nav className="bg-surface shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setIsMenuOpen(false)}>
            <span className="w-9 h-9 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold">
              H
            </span>
            <span className="text-2xl font-extrabold text-brand-navy">
              Health<span className="text-accent-blue">Ease</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} to={link.href} className="text-brand-navy font-medium hover:text-link-blue transition-colors">
                {link.label}
              </Link>
            ))}
            <Button variant="secondary" onClick={openLocations}>
              Locations
            </Button>
            <Link to="/checkout" className="relative text-brand-navy hover:text-link-blue transition-colors">
              <i className="bi bi-cart3 text-xl" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-blue text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link to="/login" className="text-brand-navy hover:text-link-blue transition-colors">
              <i className="bi bi-person-circle text-xl" />
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-4 md:hidden">
            <Link to="/checkout" className="relative text-brand-navy">
              <i className="bi bi-cart3 text-xl" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-blue text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
              <svg className="w-6 h-6 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-surface flex flex-col md:hidden animate-fade-in">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                <span className="w-9 h-9 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold">
                  H
                </span>
                <span className="text-2xl font-extrabold text-brand-navy">
                  Health<span className="text-accent-blue">Ease</span>
                </span>
              </Link>
              <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                <svg className="w-7 h-7 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 animate-fade-in-up">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-brand-navy text-2xl font-semibold hover:text-link-blue transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/login"
              className="text-brand-navy text-2xl font-semibold hover:text-link-blue transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Login / Register
            </Link>
            <Button
              variant="secondary"
              className="mt-2"
              onClick={() => {
                openLocations()
                setIsMenuOpen(false)
              }}
            >
              Locations
            </Button>
            <div className="mt-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
