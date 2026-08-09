import { useState, type FormEvent } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { inputClass, labelClass } from '#/lib/ui-classes'
import { dashboardCategories, useDashboardData } from '#/lib/dashboard-context'

export default function NewItemModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addProduct } = useDashboardData()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState(dashboardCategories[0].id)
  const [quantity, setQuantity] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !price || !quantity) return
    setSaving(true)
    try {
      await addProduct({ name, description, price: Number(price), categoryId, quantity: Number(quantity), imageUrl: imageUrl || '/images/products/bandages.png' })
      setName(''); setDescription(''); setPrice(''); setQuantity(''); setImageUrl('')
      onClose()
    } finally { setSaving(false) }
  }

  function handleImage(file: File | undefined) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImageUrl(String(reader.result))
    reader.readAsDataURL(file)
  }

  return (
    <Modal open={open} onClose={onClose} title="New Item" maxWidthClass="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Product Name</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea className={`${inputClass} min-h-20`} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Product photo</label>
          <input type="file" accept="image/*" className={inputClass} onChange={(e) => handleImage(e.target.files?.[0])} />
          {imageUrl && <img src={imageUrl} alt="Product preview" className="mt-2 h-20 w-20 rounded-lg object-cover" />}
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
        <Button type="submit" variant="primary" className="w-full" disabled={saving}>
          {saving ? 'Adding…' : 'Add Product'}
        </Button>
      </form>
    </Modal>
  )
}
