import { Link, createFileRoute } from '@tanstack/react-router'
import Hero from '#/components/Hero'
import ProductCard from '#/components/ProductCard'
import CategoryCard from '#/components/CategoryCard'
import { products, categories, mustHaveProductIds } from '#/lib/mock-data'

export const Route = createFileRoute('/_site/')({ component: Home })

function Home() {
  const mustHaveProducts = mustHaveProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p)

  const featuredCategories = categories.slice(0, 4)

  return (
    <>
      <Hero />

      {/* Everyday Must-Haves Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-brand-navy font-bold text-left text-2xl md:text-3xl">
              Everyday Must-Haves
            </h2>
            <div className="hidden md:block">
              <Link to="/essentials" className="text-link-blue hover:underline flex items-center gap-1">
                View All <span className="bi bi-arrow-right"></span>
              </Link>
            </div>
          </div>
          <p className="text-text-muted text-left mb-6">
            Essentials you can&apos;t live without.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {mustHaveProducts.map((product, i) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <ProductCard name={product.name} image={product.imageUrl} price={product.price} />
              </div>
            ))}
          </div>

          <div className="mt-4 text-center md:hidden">
            <Link to="/essentials" className="text-link-blue hover:underline inline-flex items-center gap-1">
              View All <span className="bi bi-arrow-right"></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-brand-navy font-bold text-left text-2xl md:text-3xl">
                Shop by Category
              </h2>
              <p className="text-text-muted text-left">
                Browse by category and find exactly what you&apos;re looking for.
              </p>
            </div>
            <div className="hidden md:block">
              <Link to="/shop" className="text-link-blue hover:underline flex items-center gap-1">
                View Category <span className="bi bi-arrow-right"></span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mt-4">
            {featuredCategories.map((category, i) => (
              <div
                key={category.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <CategoryCard name={category.name} image={category.image} slug={category.slug} />
              </div>
            ))}
          </div>

          <div className="mt-4 text-center md:hidden">
            <Link to="/shop" className="text-link-blue hover:underline inline-flex items-center gap-1">
              View Category <span className="bi bi-arrow-right"></span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
