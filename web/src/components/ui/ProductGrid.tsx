import { useState } from 'react'
import ProductCard from '../ProductCard'
import ProductDetailModal from './ProductDetailModal'
import { useCart } from '#/lib/cart-context'
import { useToast } from '#/lib/toast-context'
import { categories } from '#/lib/mock-data'
import type { Product } from '#/lib/types'

export default function ProductGrid({ products }: { products: Product[] }) {
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [selected, setSelected] = useState<Product | null>(null)

  function handleAddToCart(product: Product) {
    addItem(product)
    showToast(`${product.name} added to cart`)
  }

  if (products.length === 0) {
    return <div className="text-center py-16 text-text-muted-2">No products found.</div>
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            image={product.imageUrl}
            price={product.price}
            categoryName={categories.find((c) => c.id === product.categoryId)?.name}
            onAddToCart={() => handleAddToCart(product)}
            onViewDetails={() => setSelected(product)}
          />
        ))}
      </div>
      <ProductDetailModal product={selected} onClose={() => setSelected(null)} onAddToCart={handleAddToCart} />
    </>
  )
}
