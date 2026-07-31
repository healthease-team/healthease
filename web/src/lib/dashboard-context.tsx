import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { products as mockProducts, categories, orders as mockOrders } from './mock-data'
import type { Product, StockEntry, Order, OrderStatus } from './types'

const CURRENT_PHARMACY_ID = 'ph1'

interface NewProductInput {
  name: string
  price: number
  categoryId: string
  quantity: number
}

interface DashboardContextValue {
  products: Product[]
  stock: StockEntry[]
  orders: Order[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  addProduct: (input: NewProductInput) => void
  updateStockQuantity: (productId: string, quantity: number) => void
  deleteProduct: (productId: string) => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [stock, setStock] = useState<StockEntry[]>(() =>
    mockProducts.map((p, i) => ({
      id: `stock-${p.id}`,
      pharmacyId: CURRENT_PHARMACY_ID,
      productId: p.id,
      quantity: (i * 7) % 45,
    }))
  )
  const [orders, setOrders] = useState<Order[]>(() => mockOrders.filter((o) => o.pharmacyId === CURRENT_PHARMACY_ID))
  const [searchTerm, setSearchTerm] = useState('')

  function addProduct(input: NewProductInput) {
    // TODO(phase-2): insert into Supabase `products` + `stock` tables
    const id = crypto.randomUUID()
    const product: Product = {
      id,
      name: input.name,
      description: '',
      price: input.price,
      categoryId: input.categoryId,
      imageUrl: '/images/shop_all_cat.png',
    }
    setProducts((prev) => [...prev, product])
    setStock((prev) => [...prev, { id: `stock-${id}`, pharmacyId: CURRENT_PHARMACY_ID, productId: id, quantity: input.quantity }])
  }

  function updateStockQuantity(productId: string, quantity: number) {
    // TODO(phase-2): PATCH /stock via Supabase
    setStock((prev) => prev.map((s) => (s.productId === productId ? { ...s, quantity } : s)))
  }

  function deleteProduct(productId: string) {
    // TODO(phase-2): DELETE product via Supabase (owning pharmacy only, enforced by RLS)
    setProducts((prev) => prev.filter((p) => p.id !== productId))
    setStock((prev) => prev.filter((s) => s.productId !== productId))
  }

  function updateOrderStatus(orderId: string, status: OrderStatus) {
    // TODO(phase-2): PATCH order status via Supabase, sequence enforced by check constraint/trigger
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
  }

  const value = useMemo(
    () => ({ products, stock, orders, searchTerm, setSearchTerm, addProduct, updateStockQuantity, deleteProduct, updateOrderStatus }),
    [products, stock, orders, searchTerm]
  )

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboardData() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboardData must be used within a DashboardProvider')
  return ctx
}

export { categories as dashboardCategories }
