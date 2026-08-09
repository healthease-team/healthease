import { createFileRoute } from '@tanstack/react-router'
import { saveReview, getProductReviews } from '#/lib/api/reviews'

export const Route = createFileRoute('/api/db/reviews')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const productId = url.searchParams.get('productId')
        if (!productId) {
          return Response.json({ error: 'Missing productId' }, { status: 400 })
        }
        const reviews = await getProductReviews(productId)
        return Response.json(reviews)
      },
      POST: async ({ request }) => {
        const body = await request.json()
        const review = await saveReview(body)
        return Response.json(review)
      },
    },
  },
})
