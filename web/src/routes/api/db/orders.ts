import { createFileRoute } from '@tanstack/react-router'
import { saveOrder } from '#/lib/api/orders'

export const Route = createFileRoute('/api/db/orders')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json()
        const order = await saveOrder(body)
        return Response.json(order)
      },
    },
  },
})
