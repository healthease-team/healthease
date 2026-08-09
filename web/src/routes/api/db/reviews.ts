import { createFileRoute } from '@tanstack/react-router'
import { saveReview, getProductReviews } from '#/lib/api/reviews'
import { requireSession } from '#/lib/auth'

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
        try {
          const user = await requireSession(request, 'customer')
          const body = await request.json()
          const review = await saveReview({ ...body, userEmail: user.email, userName: user.name })
          return Response.json(review)
        } catch (error) { return error instanceof Response ? error : Response.json({ error: 'Unable to save review' }, { status: 500 }) }
      },
    },
  },
})
