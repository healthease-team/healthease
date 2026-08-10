import { prisma } from '#/db'
import type { Order, OrderItem } from '#/lib/types'

export interface OrderItemInput {
  productId: string
  productName: string
  unitPrice: number
  quantity: number
}

export async function saveOrder(input: {
  userEmail: string
  pharmacyId: string
  customerName: string
  email: string
  phone: string
  deliveryMethod: string
  deliveryAddress?: string | null
  pickupTime?: string | null
  customerLat?: number | null
  customerLng?: number | null
  distanceKm?: number | null
  deliveryNotes?: string | null
  prescriptionPath?: string | null
  idCardPath?: string | null
  bagTotal: number
  adminFee: number
  platformFee: number
  deliveryFee: number
  totalAmount: number
  items?: OrderItemInput[]
}) {
  const user = await prisma.user.upsert({
    where: { email: input.userEmail },
    create: { email: input.userEmail, role: 'customer', name: input.customerName },
    update: { name: input.customerName },
  })

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      pharmacyId: input.pharmacyId,
      customerName: input.customerName,
      email: input.email,
      phone: input.phone,
      deliveryMethod: input.deliveryMethod,
      deliveryAddress: input.deliveryAddress ?? null,
      pickupTime: input.pickupTime ?? null,
      customerLat: input.customerLat ?? null,
      customerLng: input.customerLng ?? null,
      distanceKm: input.distanceKm ?? null,
      deliveryNotes: input.deliveryNotes ?? null,
      prescriptionPath: input.prescriptionPath ?? null,
      idCardPath: input.idCardPath ?? null,
      bagTotal: input.bagTotal,
      adminFee: input.adminFee,
      platformFee: input.platformFee,
      deliveryFee: input.deliveryFee,
      totalAmount: input.totalAmount,
      items: input.items?.length
        ? {
            create: input.items.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
            })),
          }
        : undefined,
    },
    include: { items: true },
  })
  await prisma.notification.create({ data: { userId: user.id, title: 'Order received', message: `Your order #${order.id.slice(-8)} has been sent to the pharmacy.` } })
  return order
}

function mapOrder(row: Awaited<ReturnType<typeof fetchOrdersRaw>>[number]): Order {
  return {
    id: row.id,
    customerId: row.userId,
    pharmacyId: row.pharmacyId,
    customerName: row.customerName,
    email: row.email,
    phone: row.phone,
    deliveryMethod: row.deliveryMethod as Order['deliveryMethod'],
    deliveryAddress: row.deliveryAddress ?? undefined,
    pickupTime: row.pickupTime ?? undefined,
    customerLat: row.customerLat ?? undefined,
    customerLng: row.customerLng ?? undefined,
    distanceKm: row.distanceKm ?? undefined,
    deliveryNotes: row.deliveryNotes ?? undefined,
    prescriptionPath: row.prescriptionPath ?? undefined,
    idCardPath: row.idCardPath ?? undefined,
    bagTotal: row.bagTotal,
    adminFee: row.adminFee,
    platformFee: row.platformFee,
    deliveryFee: row.deliveryFee,
    totalAmount: row.totalAmount,
    status: row.status as Order['status'],
    paymentStatus: row.paymentStatus as Order['paymentStatus'],
    createdAt: row.createdAt.toISOString(),
    items: row.items.map(
      (item): OrderItem => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        productName: item.productName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      })
    ),
  }
}

async function fetchOrdersRaw(where: { email?: string; pharmacyId?: string }) {
  return prisma.order.findMany({
    where: {
      ...(where.email ? { email: where.email } : {}),
      ...(where.pharmacyId ? { pharmacyId: where.pharmacyId } : {}),
    },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getOrdersByEmail(email: string) {
  const rows = await fetchOrdersRaw({ email })
  return rows.map(mapOrder)
}

export async function getOrdersByPharmacy(pharmacyId: string) {
  const rows = await fetchOrdersRaw({ pharmacyId })
  return rows.map(mapOrder)
}

export async function getAllOrders() {
  const rows = await fetchOrdersRaw({})
  return rows.map(mapOrder)
}

export async function updateOrderStatus(orderId: string, status: string) {
  const row = await prisma.order.update({
    where: { id: orderId },
    data: { status, updatedAt: new Date() },
    include: { items: true },
  })
  await prisma.notification.create({ data: { userId: row.userId, title: 'Order update', message: `Your order #${row.id.slice(-8)} is now ${status.replaceAll('_', ' ')}.` } })
  return mapOrder(row)
}
