import { createFileRoute } from '@tanstack/react-router'
import { createUser, deleteUser, listUsers, resetUserPassword, updateUser } from '#/lib/api/users'
import { requireSession } from '#/lib/auth'

const VALID_ROLES = ['customer', 'pharmacy', 'admin'] as const
const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 128
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidRole(role: unknown): role is (typeof VALID_ROLES)[number] {
  return typeof role === 'string' && VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])
}

export const Route = createFileRoute('/api/db/users')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          await requireSession(request, 'admin')
          const users = await listUsers()
          return Response.json(users)
        } catch (error) {
          if (error instanceof Response) return error
          console.error('GET users failed:', error)
          return Response.json({ error: 'Failed to fetch users' }, { status: 500 })
        }
      },
      POST: async ({ request }) => {
        try {
          await requireSession(request, 'admin')
          const body = (await request.json()) as { name?: string; email?: string; password?: string; role?: string }
          const name = body.name?.trim()
          const email = body.email?.trim()
          const { password, role } = body
          if (!name || !email || !password || !role) {
            return Response.json({ error: 'Missing name, email, password or role' }, { status: 400 })
          }
          if (!EMAIL_REGEX.test(email)) {
            return Response.json({ error: 'Invalid email address' }, { status: 400 })
          }
          if (!isValidRole(role)) {
            return Response.json({ error: 'Invalid role' }, { status: 400 })
          }
          if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
            return Response.json(
              { error: `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.` },
              { status: 400 }
            )
          }
          const created = await createUser({ name, email, password, role })
          return Response.json(created, { status: 201 })
        } catch (error) {
          if (error instanceof Response) return error
          const message = error instanceof Error ? error.message : 'Failed to create user'
          console.error('POST user failed:', error)
          return Response.json({ error: message }, { status: 400 })
        }
      },
      PATCH: async ({ request }) => {
        try {
          const session = await requireSession(request, 'admin')
          const body = (await request.json()) as { userId?: string; role?: string; name?: string; email?: string }
          const { userId, role } = body
          const name = body.name?.trim()
          const email = body.email?.trim()
          if (!userId) {
            return Response.json({ error: 'Missing userId' }, { status: 400 })
          }
          if (role === undefined && name === undefined && email === undefined) {
            return Response.json({ error: 'Nothing to update' }, { status: 400 })
          }
          if (role !== undefined) {
            if (!isValidRole(role)) {
              return Response.json({ error: 'Invalid role' }, { status: 400 })
            }
            if (userId === session.id) {
              return Response.json({ error: 'You cannot change your own role.' }, { status: 400 })
            }
          }
          if (email !== undefined && (!email || !EMAIL_REGEX.test(email))) {
            return Response.json({ error: 'Invalid email address' }, { status: 400 })
          }
          if (name !== undefined && !name) {
            return Response.json({ error: 'Name cannot be empty' }, { status: 400 })
          }
          const updated = await updateUser(userId, { role: role as (typeof VALID_ROLES)[number] | undefined, name, email })
          return Response.json(updated)
        } catch (error) {
          if (error instanceof Response) return error
          const message = error instanceof Error ? error.message : 'Failed to update user'
          console.error('PATCH user failed:', error)
          return Response.json({ error: message }, { status: 400 })
        }
      },
      PUT: async ({ request }) => {
        try {
          await requireSession(request, 'admin')
          const body = (await request.json()) as { userId?: string; newPassword?: string }
          const { userId, newPassword } = body
          if (!userId || !newPassword) {
            return Response.json({ error: 'Missing userId or newPassword' }, { status: 400 })
          }
          if (newPassword.length < MIN_PASSWORD_LENGTH || newPassword.length > MAX_PASSWORD_LENGTH) {
            return Response.json(
              { error: `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.` },
              { status: 400 }
            )
          }
          await resetUserPassword(userId, newPassword)
          return Response.json({ ok: true })
        } catch (error) {
          if (error instanceof Response) return error
          console.error('PUT user password reset failed:', error)
          return Response.json({ error: 'Failed to reset password' }, { status: 500 })
        }
      },
      DELETE: async ({ request }) => {
        try {
          const session = await requireSession(request, 'admin')
          const url = new URL(request.url)
          const userId = url.searchParams.get('userId')
          if (!userId) {
            return Response.json({ error: 'Missing userId' }, { status: 400 })
          }
          if (userId === session.id) {
            return Response.json({ error: 'You cannot delete your own account.' }, { status: 400 })
          }
          await deleteUser(userId)
          return Response.json({ ok: true })
        } catch (error) {
          if (error instanceof Response) return error
          const message = error instanceof Error ? error.message : 'Failed to delete user'
          console.error('DELETE user failed:', error)
          return Response.json({ error: message }, { status: 400 })
        }
      },
    },
  },
})
