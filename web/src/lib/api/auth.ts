import { auth } from '#/lib/auth'

export async function signUpWithEmail(input: { email: string; password: string; name: string; role?: string }) {
  return auth.api.signUpEmail({
    body: {
      email: input.email,
      password: input.password,
      name: input.name,
      role: input.role ?? 'customer',
    },
  })
}

export async function signInWithEmail(input: { email: string; password: string }) {
  return auth.api.signInEmail({
    body: {
      email: input.email,
      password: input.password,
    },
  })
}
