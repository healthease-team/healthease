import { useState } from 'react'
import { useDashboardData, dashboardCategories } from '#/lib/dashboard-context'
import Modal from '../ui/Modal'
import type { Product } from '#/lib/types'

export default function StockManager() {
  const { products, stock, searchTerm, updateProduct, deleteProduct } = useDashboardData()
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null)
  const [draft, setDraft] = useState({ name: '', description: '', price: 0, categoryId: '', quantity: 0, imageUrl: '' })
  const [imageUrlInput, setImageUrlInput] = useState('')

  const term = searchTerm.trim().toLowerCase()
  const visibleProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.categoryId === activeCategory
    const matchesSearch = !term || `${p.name} ${p.description}`.toLowerCase().includes(term)
    return matchesCategory && matchesSearch
  })

  function startEdit(productId: string) {
    const product = products.find((item) => item.id === productId)
    if (!product) return
    setDraft({ ...product, quantity: stock.find((entry) => entry.productId === productId)?.quantity ?? 0 })
    setImageUrlInput('')
    setEditingId(productId)
  }

  async function saveEdit() {
    if (!editingId) return
    await updateProduct(editingId, draft)
    setEditingId(null)
  }

  function updateImage(file: File | undefined) {
    if (!file) return
    setImageUrlInput('')
    const reader = new FileReader()
    reader.onload = () => setDraft((current) => ({ ...current, imageUrl: String(reader.result) }))
    reader.readAsDataURL(file)
  }

  return (
    <div className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-5">
      <h2 className="text-lg font-bold text-brand-navy mb-4">Stock Management</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <button className={`px-4 py-1.5 rounded-full text-sm font-medium ${activeCategory === 'all' ? 'bg-brand-navy text-white dark:text-slate-900' : 'bg-mint-light text-brand-navy hover:bg-mint'}`} onClick={() => setActiveCategory('all')}>All</button>
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
            {editingId === product.id ? <div className="flex-1 grid gap-2 sm:grid-cols-2">
              <input className="rounded border p-1 text-sm" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              <input type="number" className="rounded border p-1 text-sm" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} />
              <textarea className="rounded border p-1 text-sm sm:col-span-2" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
              <select className="rounded border p-1 text-sm" value={draft.categoryId} onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}>{dashboardCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
              <input type="number" min={0} className="rounded border p-1 text-sm" value={draft.quantity} onChange={(e) => setDraft({ ...draft, quantity: Number(e.target.value) })} />
              <input type="file" accept="image/*" className="text-xs sm:col-span-2" onChange={(e) => updateImage(e.target.files?.[0])} />
              <input
                type="url"
                placeholder="Or paste an image URL"
                className="rounded border p-1 text-sm sm:col-span-2"
                value={imageUrlInput}
                onChange={(e) => {
                  setImageUrlInput(e.target.value)
                  setDraft((current) => ({ ...current, imageUrl: e.target.value }))
                }}
              />
            </div> : <><img src={product.imageUrl} alt="" className="h-10 w-10 rounded object-cover" /><div className="flex-1 min-w-0"><div className="text-sm font-medium text-brand-navy truncate">{product.name}</div><div className="text-xs text-text-muted-2">SRD {product.price} · Stock {stock.find((entry) => entry.productId === product.id)?.quantity ?? 0}</div></div></>}
            {editingId === product.id ? <><button className="text-xs font-semibold text-link-blue hover:underline" onClick={() => void saveEdit()}>Done</button><button className="text-xs" onClick={() => setEditingId(null)}>Cancel</button></> : <button className="text-xs font-semibold text-link-blue hover:underline" onClick={() => startEdit(product.id)}>Edit</button>}
            <button className="text-text-muted-2 hover:text-link-blue" onClick={() => setViewingProduct(product)} aria-label={`View ${product.name}`} title="View product details"><i className="bi bi-eye" /></button>
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
      <Modal open={!!viewingProduct} onClose={() => setViewingProduct(null)} title="Product Details" maxWidthClass="max-w-md">
        {viewingProduct && <div className="space-y-3 text-sm text-text-muted"><img src={viewingProduct.imageUrl} alt={viewingProduct.name} className="mx-auto h-40 w-full rounded-xl object-contain bg-mint-light/30" /><div><span className="font-semibold text-brand-navy">Name:</span> {viewingProduct.name}</div><div><span className="font-semibold text-brand-navy">Price:</span> SRD {viewingProduct.price.toFixed(2)}</div><div><span className="font-semibold text-brand-navy">Description:</span> {viewingProduct.description || 'No description provided.'}</div><div><span className="font-semibold text-brand-navy">Stock:</span> {stock.find((entry) => entry.productId === viewingProduct.id)?.quantity ?? 0}</div></div>}
      </Modal>
    </div>
  )
}
