import { betterAuth } from 'better-auth'
import { prismaAdapter } from '@better-auth/prisma-adapter'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { prisma } from '#/db'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {},
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'customer',
      },
    },
  },
  plugins: [tanstackStartCookies()],
})

export async function requireSession(request: Request, requiredRole?: 'customer' | 'pharmacy' | 'admin') {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) throw new Response('Authentication required', { status: 401 })
  const role = (session.user as { role?: string }).role
  if (requiredRole && role !== requiredRole) throw new Response('Not authorised', { status: 403 })
  return { id: session.user.id, email: session.user.email, name: session.user.name ?? '', role }
}
