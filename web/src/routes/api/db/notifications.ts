import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '#/db'
import { requireSession } from '#/lib/auth'

export const Route = createFileRoute('/api/db/notifications')({
  server: { handlers: { GET: async ({ request }) => {
    try {
      const user = await requireSession(request)
      const notifications = await prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 20 })
      return Response.json(notifications)
    } catch (error) { return error instanceof Response ? error : Response.json({ error: 'Unable to load notifications' }, { status: 500 }) }
  } } },
})
