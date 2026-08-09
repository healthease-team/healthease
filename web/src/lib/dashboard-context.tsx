import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { categories } from './mock-data'
import type { Product, StockEntry, Order, OrderStatus } from './types'

const CURRENT_PHARMACY_ID = 'ph1'

export interface ProductInput {
  name: string
  description: string
  price: number
  categoryId: string
  quantity: number
  imageUrl: string
}

interface DashboardContextValue {
  products: Product[]
  stock: StockEntry[]
  orders: Order[]
  loading: boolean
  searchTerm: string
  setSearchTerm: (term: string) => void
  addProduct: (input: ProductInput) => Promise<void>
  updateProduct: (productId: string, input: Partial<ProductInput>) => Promise<void>
  deleteProduct: (productId: string) => Promise<void>
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [stock, setStock] = useState<StockEntry[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  async function load() {
    try {
      const [productsResponse, ordersResponse] = await Promise.all([
        fetch('/api/db/products'),
        fetch(`/api/db/orders?pharmacyId=${CURRENT_PHARMACY_ID}`),
      ])
      if (productsResponse.ok) {
        const rows = await productsResponse.json() as Array<{ product: Product; stock: StockEntry | null }>
        setProducts(rows.map((row) => row.product))
        setStock(rows.flatMap((row) => row.stock ? [row.stock] : []))
      }
      if (ordersResponse.ok) setOrders(await ordersResponse.json() as Order[])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  async function addProduct(input: ProductInput) {
    const response = await fetch('/api/db/products', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, pharmacyId: CURRENT_PHARMACY_ID }),
    })
    if (!response.ok) throw new Error('Unable to add product')
    await load()
  }

  async function updateProduct(productId: string, input: Partial<ProductInput>) {
    const response = await fetch('/api/db/products', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, ...input }),
    })
    if (!response.ok) throw new Error('Unable to update product')
    await load()
  }

  async function deleteProduct(productId: string) {
    const response = await fetch(`/api/db/products?productId=${encodeURIComponent(productId)}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Unable to delete product')
    await load()
  }

  async function updateOrderStatus(orderId: string, status: OrderStatus) {
    const response = await fetch('/api/db/orders', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId, status }),
    })
    if (!response.ok) throw new Error('Unable to update order')
    const updated = await response.json() as Order
    setOrders((current) => current.map((order) => order.id === orderId ? updated : order))
  }

  const value = useMemo(() => ({ products, stock, orders, loading, searchTerm, setSearchTerm, addProduct, updateProduct, deleteProduct, updateOrderStatus }), [products, stock, orders, loading, searchTerm])
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboardData() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboardData must be used within a DashboardProvider')
  return ctx
}

export { categories as dashboardCategories }
