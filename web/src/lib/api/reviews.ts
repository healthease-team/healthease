import { prisma } from '#/db'

export async function saveReview(input: {
  userEmail: string
  userName?: string
  productId: string
  rating: number
  comment: string
}) {
  const user = await prisma.user.upsert({
    where: { email: input.userEmail },
    create: { email: input.userEmail, role: 'customer', name: input.userName ?? input.userEmail },
    update: input.userName ? { name: input.userName } : {},
  })

  return prisma.review.create({
    data: {
      userId: user.id,
      productId: input.productId,
      rating: input.rating,
      comment: input.comment,
    },
    include: { user: true },
  })
}

export async function getProductReviews(productId: string) {
  return prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  })
}

export async function getTestimonialReviews(limit = 12) {
  return prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { user: true },
  })
}
