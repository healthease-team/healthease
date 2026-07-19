import { Link, createFileRoute } from '@tanstack/react-router'
import ShopSearch from '#/components/ShopSearch'
import { categories, products } from '#/lib/mock-data'

export const Route = createFileRoute('/_site/shop')({
  validateSearch: (search: Record<string, unknown>): { category?: string } => ({
    category: typeof search.category === 'string' ? search.category : undefined,
  }),
  component: ShopPage,
})

function ShopPage() {
  const { category } = Route.useSearch()

  const activeCategory = category ? categories.find((c) => c.id === category || c.slug === category) : undefined

  const filtered = activeCategory
    ? products.filter((p) => p.categoryId === activeCategory.id)
    : products

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-navy mb-2">
        Shop {activeCategory ? `- ${activeCategory.name}` : ''}
      </h1>
      <p className="text-text-muted mb-8">
        {activeCategory
          ? `Browse all products in ${activeCategory.name}`
          : 'Browse all our products and categories'}
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-3 mb-8">
        <Link
          to="/shop"
          className={`rounded-2xl border p-3 flex flex-col items-center justify-center text-center gap-1 transition-colors ${
            !activeCategory ? 'bg-brand-navy text-white dark:text-slate-900 border-brand-navy' : 'bg-surface text-brand-navy border-brand-navy/10 hover:border-brand-navy/30'
          }`}
        >
          <i className="bi bi-grid-3x3-gap text-lg" />
          <span className="text-xs font-medium">All</span>
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            to="/shop"
            search={{ category: c.slug }}
            className={`rounded-2xl border p-3 flex flex-col items-center justify-center text-center gap-1 transition-colors ${
              activeCategory?.id === c.id ? 'bg-brand-navy text-white dark:text-slate-900 border-brand-navy' : 'bg-surface text-brand-navy border-brand-navy/10 hover:border-brand-navy/30'
            }`}
          >
            <span className="text-xs font-medium">{c.name}</span>
          </Link>
        ))}
      </div>

      <ShopSearch products={filtered} />
    </div>
  )
}
