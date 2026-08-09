import { prisma } from '#/db'

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
}) {
  const user = await prisma.user.upsert({
    where: { email: input.userEmail },
    create: { email: input.userEmail, role: 'customer', name: input.customerName },
    update: {},
  })

  return prisma.order.create({
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
    },
  })
}
