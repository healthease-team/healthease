import { createFileRoute } from '@tanstack/react-router'
import { createProduct, deleteProduct, getProducts, updateProduct } from '#/lib/api/products'
import { requireSession } from '#/lib/auth'

export const Route = createFileRoute('/api/db/products')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const products = await getProducts()
          return Response.json(products)
        } catch (error) {
          console.error('GET products failed:', error)
          return Response.json({ error: 'Failed to fetch products' }, { status: 500 })
        }
      },
      POST: async ({ request }) => {
        try {
          await requireSession(request, 'pharmacy')
          const body = await request.json()
          const product = await createProduct(body)
          return Response.json(product)
        } catch (error) {
          console.error('POST product failed:', error)
          return Response.json({ error: 'Failed to create product' }, { status: 500 })
        }
      },
      PATCH: async ({ request }) => {
        try {
          await requireSession(request, 'pharmacy')
          const body = await request.json()
          const { productId, ...data } = body as { productId?: string } & Record<string, unknown>
          if (!productId) {
            return Response.json({ error: 'Missing productId' }, { status: 400 })
          }
          const product = await updateProduct(productId, data)
          return Response.json(product)
        } catch (error) {
          console.error('PATCH product failed:', error)
          return Response.json({ error: 'Failed to update product' }, { status: 500 })
        }
      },
      DELETE: async ({ request }) => {
        try {
          await requireSession(request, 'pharmacy')
          const url = new URL(request.url)
          const productId = url.searchParams.get('productId')
          if (!productId) {
            return Response.json({ error: 'Missing productId' }, { status: 400 })
          }
          await deleteProduct(productId)
          return Response.json({ ok: true })
        } catch (error) {
          console.error('DELETE product failed:', error)
          return Response.json({ error: 'Failed to delete product' }, { status: 500 })
        }
      },
    },
  },
})
