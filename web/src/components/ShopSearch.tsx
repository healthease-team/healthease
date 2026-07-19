import { useMemo, useState } from 'react'
import ProductGrid from './ui/ProductGrid'
import type { Product } from '#/lib/types'

export default function ShopSearch({ products }: { products: Product[] }) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return products
    return products.filter((p) => p.name.toLowerCase().includes(term))
  }, [products, search])

  return (
    <div>
      <div className="relative mb-6 max-w-sm">
        <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-text-muted-2 text-sm" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          aria-label="Search products"
          className="w-full rounded-full border border-brand-navy/15 bg-surface text-brand-navy placeholder:text-text-muted-2 pl-10 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-2 hover:text-brand-navy"
          >
            <i className="bi bi-x-circle-fill" />
          </button>
        )}
      </div>

      {search.trim() && (
        <p className="text-sm text-text-muted-2 mb-4">
          {filtered.length} result{filtered.length === 1 ? '' : 's'} for &ldquo;{search.trim()}&rdquo;
        </p>
      )}

      <ProductGrid products={filtered} />
    </div>
  )
}
