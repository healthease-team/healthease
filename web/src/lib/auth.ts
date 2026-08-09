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
