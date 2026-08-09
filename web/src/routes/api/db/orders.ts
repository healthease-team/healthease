import { createFileRoute } from '@tanstack/react-router'
import { getOrdersByEmail, getOrdersByPharmacy, saveOrder, updateOrderStatus } from '#/lib/api/orders'

export const Route = createFileRoute('/api/db/orders')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const email = url.searchParams.get('email')
        const pharmacyId = url.searchParams.get('pharmacyId')

        try {
          if (email) {
            const orders = await getOrdersByEmail(email)
            return Response.json(orders)
          }
          if (pharmacyId) {
            const orders = await getOrdersByPharmacy(pharmacyId)
            return Response.json(orders)
          }
          return Response.json({ error: 'Missing email or pharmacyId' }, { status: 400 })
        } catch (error) {
          console.error('GET orders failed:', error)
          return Response.json({ error: 'Failed to fetch orders' }, { status: 500 })
        }
      },
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const order = await saveOrder(body)
          return Response.json(order)
        } catch (error) {
          console.error('POST order failed:', error)
          return Response.json({ error: 'Failed to save order' }, { status: 500 })
        }
      },
      PATCH: async ({ request }) => {
        try {
          const body = await request.json()
          const { orderId, status } = body as { orderId?: string; status?: string }
          if (!orderId || !status) {
            return Response.json({ error: 'Missing orderId or status' }, { status: 400 })
          }
          const order = await updateOrderStatus(orderId, status)
          return Response.json(order)
        } catch (error) {
          console.error('PATCH order failed:', error)
          return Response.json({ error: 'Failed to update order' }, { status: 500 })
        }
      },
    },
  },
})
