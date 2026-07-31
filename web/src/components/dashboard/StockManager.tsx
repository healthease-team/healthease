import { useState } from 'react'
import { useDashboardData, dashboardCategories } from '#/lib/dashboard-context'

export default function StockManager() {
  const { products, stock, searchTerm, updateStockQuantity, deleteProduct } = useDashboardData()
  const [activeCategory, setActiveCategory] = useState<string>(dashboardCategories[0].id)
  const [pendingQuantities, setPendingQuantities] = useState<Record<string, number>>({})

  const term = searchTerm.trim().toLowerCase()
  const visibleProducts = products.filter((p) => {
    const matchesCategory = p.categoryId === activeCategory
    const matchesSearch = !term || p.name.toLowerCase().includes(term)
    return matchesCategory && matchesSearch
  })

  function quantityFor(productId: string) {
    const stockEntry = stock.find((s) => s.productId === productId)
    return pendingQuantities[productId] ?? stockEntry?.quantity ?? 0
  }

  function handleSave(productId: string) {
    updateStockQuantity(productId, quantityFor(productId))
    setPendingQuantities((prev) => {
      const next = { ...prev }
      delete next[productId]
      return next
    })
  }

  return (
    <div className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-5">
      <h2 className="text-lg font-bold text-brand-navy mb-4">Stock Management</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {dashboardCategories.map((c) => (
          <button
            key={c.id}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === c.id ? 'bg-brand-navy text-white dark:text-slate-900' : 'bg-mint-light text-brand-navy hover:bg-mint'
            }`}
            onClick={() => setActiveCategory(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {visibleProducts.length === 0 && (
          <p className="text-text-muted-2 text-sm py-4">No products in this category.</p>
        )}
        {visibleProducts.map((product) => (
          <div key={product.id} className="flex items-center gap-3 py-2 border-b border-brand-navy/5 last:border-0">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-brand-navy truncate">{product.name}</div>
              <div className="text-xs text-text-muted-2">SRD {product.price}</div>
            </div>
            <input
              type="number"
              min={0}
              value={quantityFor(product.id)}
              onChange={(e) =>
                setPendingQuantities((prev) => ({ ...prev, [product.id]: Number(e.target.value) }))
              }
              className="w-16 rounded-lg border border-brand-navy/15 bg-surface text-brand-navy px-2 py-1 text-sm text-center"
            />
            <button
              className="text-xs font-semibold text-link-blue hover:underline"
              onClick={() => handleSave(product.id)}
            >
              Save
            </button>
            <button
              className="text-text-muted-2 hover:text-red-600"
              onClick={() => deleteProduct(product.id)}
              aria-label={`Delete ${product.name}`}
            >
              <i className="bi bi-trash" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
