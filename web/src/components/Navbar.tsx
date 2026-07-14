import { Link } from "@tanstack/react-router";
import { Menu, ShoppingCart, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          to="/"
          className="display-title text-3xl font-bold text-[var(--sea-ink)] no-underline"
        >
          Health<span className="text-[var(--lagoon)]">Ease</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="nav-link">
            Home
          </Link>

          <Link to="/shop" className="nav-link">
            Shop
          </Link>

          <Link to="/essentials" className="nav-link">
            Essentials
          </Link>

          <Link to="/contact" className="nav-link">
            Contact
          </Link>

          <Link to="/faq" className="nav-link">
            FAQ
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          <button className="rounded-full p-2 transition hover:bg-white">
            <ShoppingCart size={22} />
          </button>

          <Link
            to="/account"
            className="rounded-full bg-[var(--lagoon)] px-5 py-2 font-semibold text-white no-underline transition hover:bg-[var(--lagoon-deep)]"
          >
            <User size={18} className="mr-2 inline" />
            Account
          </Link>

          <button className="rounded-full p-2 md:hidden">
            <Menu />
          </button>

        </div>

      </div>
    </header>
  );
}