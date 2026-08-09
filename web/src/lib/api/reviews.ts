import { prisma } from '#/db'

export async function saveReview(input: { userEmail: string; productId: string; rating: number; comment: string }) {
  const user = await prisma.user.upsert({
    where: { email: input.userEmail },
    create: { email: input.userEmail, role: 'customer', name: input.userEmail },
    update: {},
  })

  return prisma.review.create({
    data: {
      userId: user.id,
      productId: input.productId,
      rating: input.rating,
      comment: input.comment,
    },
  })
}

export async function getProductReviews(productId: string) {
  return prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  })
}
