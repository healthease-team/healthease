import { useState, type FormEvent } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { inputClass, labelClass } from '#/lib/ui-classes'
import { dashboardCategories, useDashboardData } from '#/lib/dashboard-context'

export default function NewItemModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addProduct } = useDashboardData()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState(dashboardCategories[0].id)
  const [quantity, setQuantity] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !price || !quantity) return
    addProduct({ name, price: Number(price), categoryId, quantity: Number(quantity) })
    setName('')
    setPrice('')
    setQuantity('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="New Item" maxWidthClass="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Product Name</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select className={inputClass} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {dashboardCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Price (SRD)</label>
            <input type="number" min={0} className={inputClass} value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Starting Stock</label>
            <input type="number" min={0} className={inputClass} value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          </div>
        </div>
        <Button type="submit" variant="primary" className="w-full">
          Add Product
        </Button>
      </form>
    </Modal>
  )
}
