import { createFileRoute } from '@tanstack/react-router'
import { getAllOrders, getOrdersByEmail, getOrdersByPharmacy, saveOrder, updateOrderStatus } from '#/lib/api/orders'
import { requireSession } from '#/lib/auth'

export const Route = createFileRoute('/api/db/orders')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const email = url.searchParams.get('email')
        const pharmacyId = url.searchParams.get('pharmacyId')

        try {
          const user = await requireSession(request)
          if (email) {
            if (user.role !== 'admin' && user.email !== email) return Response.json({ error: 'Not authorised' }, { status: 403 })
            const orders = await getOrdersByEmail(email)
            return Response.json(orders)
          }
          if (pharmacyId) {
            if (user.role !== 'pharmacy' && user.role !== 'admin') return Response.json({ error: 'Not authorised' }, { status: 403 })
            const orders = await getOrdersByPharmacy(pharmacyId)
            return Response.json(orders)
          }
          if (user.role === 'admin') {
            const orders = await getAllOrders()
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
          const user = await requireSession(request, 'customer')
          body.userEmail = user.email
          body.email = user.email
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
          const user = await requireSession(request)
          const existing = await getOrdersByEmail(user.email)
          const ownsOrder = existing.some((order) => order.id === orderId)
          if (user.role === 'customer' && (!ownsOrder || status !== 'cancelled')) return Response.json({ error: 'Customers can only cancel their own pending orders' }, { status: 403 })
          if (user.role !== 'customer' && user.role !== 'pharmacy' && user.role !== 'admin') return Response.json({ error: 'Not authorised' }, { status: 403 })
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
