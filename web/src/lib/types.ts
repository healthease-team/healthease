export type UserRole = 'customer' | 'pharmacy' | 'admin'

export interface Profile {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface Pharmacy {
  id: string
  ownerId: string
  name: string
  address: string
  lat: number
  lng: number
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  subCategory?: EssentialsTag
  imageUrl: string
}

export interface StockEntry {
  id: string
  pharmacyId: string
  productId: string
  quantity: number
}

export type EssentialsTag = 'morning' | 'on-the-go' | 'night' | 'travel' | 'office' | 'sports'

export type DeliveryMethod = 'pickup' | 'delivery'
export type PaymentStatus = 'unpaid' | 'paid'

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'ready'
  | 'ready_for_delivery'
  | 'ready_for_pickup'
  | 'on_its_way'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  unitPrice: number
  quantity: number
}

export interface Order {
  id: string
  customerId: string
  pharmacyId: string
  customerName: string
  email: string
  phone: string
  deliveryMethod: DeliveryMethod
  deliveryAddress?: string
  pickupTime?: string
  customerLat?: number
  customerLng?: number
  distanceKm?: number
  prescriptionPath?: string
  idCardPath?: string
  bagTotal: number
  adminFee: number
  platformFee: number
  deliveryFee: number
  totalAmount: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  createdAt: string
  items: OrderItem[]
}

export interface Review {
  id: string
  authorId?: string
  authorName: string
  comment: string
  rating: 1 | 2 | 3 | 4 | 5
  createdAt: string
}

export type MessageType = 'consulting' | 'sponsoring'

export interface Message {
  id: string
  name: string
  email: string
  location: string
  type: MessageType
  message: string
  createdAt: string
  readAt?: string
}

export interface CartItem {
  productId: string
  name: string
  image: string
  price: number
  quantity: number
}

export interface FaqItem {
  question: string
  answer: string
}
