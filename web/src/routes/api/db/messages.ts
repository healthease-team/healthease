import { createFileRoute } from '@tanstack/react-router'
import { saveContactMessage } from '#/lib/api/messages'

export const Route = createFileRoute('/api/db/messages')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json()
        const message = await saveContactMessage(body)
        return Response.json(message)
      },
    },
  },
})
