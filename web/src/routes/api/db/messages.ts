import { createFileRoute } from '@tanstack/react-router'
import { listMessages, markMessageRead, saveContactMessage } from '#/lib/api/messages'
import { requireSession } from '#/lib/auth'

export const Route = createFileRoute('/api/db/messages')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          await requireSession(request, 'admin')
          const messages = await listMessages()
          return Response.json(messages)
        } catch (error) {
          if (error instanceof Response) return error
          console.error('GET messages failed:', error)
          return Response.json({ error: 'Failed to fetch messages' }, { status: 500 })
        }
      },
      POST: async ({ request }) => {
        const body = await request.json()
        const message = await saveContactMessage(body)
        return Response.json(message)
      },
      PATCH: async ({ request }) => {
        try {
          await requireSession(request, 'admin')
          const body = (await request.json()) as { id?: string }
          if (!body.id) {
            return Response.json({ error: 'Missing id' }, { status: 400 })
          }
          const message = await markMessageRead(body.id)
          return Response.json(message)
        } catch (error) {
          if (error instanceof Response) return error
          console.error('PATCH message failed:', error)
          return Response.json({ error: 'Failed to update message' }, { status: 500 })
        }
      },
    },
  },
})
