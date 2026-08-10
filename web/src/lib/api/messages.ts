import { prisma } from '#/db'
import type { Message } from '#/lib/types'

function mapMessage(row: {
  id: string
  name: string
  email: string
  location: string
  type: string
  message: string
  createdAt: Date
  readAt: Date | null
}): Message {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    location: row.location,
    type: row.type as Message['type'],
    message: row.message,
    createdAt: row.createdAt.toISOString(),
    readAt: row.readAt ? row.readAt.toISOString() : undefined,
  }
}

export async function listMessages() {
  const rows = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })
  return rows.map(mapMessage)
}

export async function markMessageRead(id: string) {
  const row = await prisma.contactMessage.update({
    where: { id },
    data: { readAt: new Date() },
  })
  return mapMessage(row)
}

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
