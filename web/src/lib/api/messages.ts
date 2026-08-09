import { prisma } from '#/db'

export async function saveContactMessage(input: {
  userEmail?: string
  name: string
  email: string
  location: string
  type: string
  message: string
}) {
  let userId: string | null = null

  if (input.userEmail) {
    const user = await prisma.user.upsert({
      where: { email: input.userEmail },
      create: { email: input.userEmail, role: 'customer', name: input.name },
      update: {},
    })
    userId = user.id
  }

  return prisma.contactMessage.create({
    data: {
      userId: userId ?? undefined,
      name: input.name,
      email: input.email,
      location: input.location,
      type: input.type,
      message: input.message,
    },
  })
}
