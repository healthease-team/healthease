import { hashPassword } from 'better-auth/crypto'
import { prisma } from '#/db'
import type { AdminUser } from '#/lib/types'

type UserWithOrderCount = {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
  _count: { orders: number }
}

function toAdminUser(row: UserWithOrderCount): AdminUser {
  return {
    id: row.id,
    name: row.name ?? '',
    email: row.email,
    role: row.role as AdminUser['role'],
    createdAt: row.createdAt.toISOString(),
    orderCount: row._count.orders,
  }
}

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2002'
}

export async function listUsers(): Promise<AdminUser[]> {
  const rows = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { orders: true } } },
  })

  return rows.map(toAdminUser)
}

export async function createUser(input: { name: string; email: string; password: string; role: AdminUser['role'] }): Promise<AdminUser> {
  const email = input.email.trim().toLowerCase()

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new Error('A user with this email already exists.')
  }

  const hashed = await hashPassword(input.password)

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: { email, name: input.name, role: input.role, emailVerified: false },
    })
    await tx.account.create({
      data: { userId: created.id, providerId: 'credential', accountId: created.id, password: hashed },
    })
    return created
  })

  return toAdminUser({ ...user, _count: { orders: 0 } })
}

export async function updateUser(
  userId: string,
  input: { role?: AdminUser['role']; name?: string; email?: string }
): Promise<AdminUser> {
  const data: { role?: AdminUser['role']; name?: string; email?: string } = {}
  if (input.role !== undefined) data.role = input.role
  if (input.name !== undefined) data.name = input.name
  if (input.email !== undefined) data.email = input.email.trim().toLowerCase()

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      include: { _count: { select: { orders: true } } },
    })
    return toAdminUser(user)
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new Error('A user with this email already exists.')
    }
    throw error
  }
}

export async function resetUserPassword(userId: string, newPassword: string) {
  const hashed = await hashPassword(newPassword)

  const existing = await prisma.account.findFirst({ where: { userId, providerId: 'credential' } })
  if (existing) {
    await prisma.account.update({ where: { id: existing.id }, data: { password: hashed } })
  } else {
    await prisma.account.create({
      data: { userId, providerId: 'credential', accountId: userId, password: hashed },
    })
  }
}

export async function deleteUser(userId: string) {
  const orderCount = await prisma.order.count({ where: { userId } })
  if (orderCount > 0) {
    throw new Error(`Cannot delete this user: they have ${orderCount} order${orderCount === 1 ? '' : 's'} on record.`)
  }

  await prisma.user.delete({ where: { id: userId } })
}
