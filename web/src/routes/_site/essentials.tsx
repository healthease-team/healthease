import { Link, createFileRoute } from '@tanstack/react-router'
import CategoryCard from '#/components/CategoryCard'
import ProductGrid from '#/components/ui/ProductGrid'
import { essentialsCategories, products } from '#/lib/mock-data'
import { ESSENTIALS_TAG_LABELS } from '#/lib/constants'

export const Route = createFileRoute('/_site/essentials')({
  validateSearch: (search: Record<string, unknown>): { tag?: string } => ({
    tag: typeof search.tag === 'string' ? search.tag : undefined,
  }),
  component: EssentialsPage,
})

function EssentialsPage() {
  const { tag } = Route.useSearch()

  if (!tag) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-brand-navy mb-2">Everyday Must-Haves</h1>
        <p className="text-text-muted mb-8">Essentials you can&apos;t live without.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {essentialsCategories.map((c) => (
            <CategoryCard
              key={c.tag}
              name={c.name}
              image={c.image}
              slug={c.tag}
              size="lg"
              to="/essentials"
              search={{ tag: c.tag }}
            />
          ))}
        </div>
      </div>
    )
  }

  const filtered = products.filter((p) => p.subCategory === tag)
  const label = ESSENTIALS_TAG_LABELS[tag] ?? tag

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/essentials" className="text-link-blue hover:underline inline-flex items-center gap-1 mb-4">
        <i className="bi bi-arrow-left" /> Back to Essentials
      </Link>
      <h1 className="text-3xl font-bold text-brand-navy mb-2">{label}</h1>
      <p className="text-text-muted mb-8">Curated picks for {label.toLowerCase()}.</p>
      <ProductGrid products={filtered} />
    </div>
  )
}
