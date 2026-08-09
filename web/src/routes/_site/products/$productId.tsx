import { Link, createFileRoute } from '@tanstack/react-router'
import Button from '#/components/ui/Button'
import { products as mockProducts } from '#/lib/mock-data'
import { useCart } from '#/lib/cart-context'
import { useToast } from '#/lib/toast-context'
import { reviews as mockReviews } from '#/lib/mock-data'
import StarRating from '#/components/ui/StarRating'
import { getCustomerSession } from '#/lib/customer-auth'
import { addReview, getReviews } from '#/lib/reviews-store'
import { useEffect, useState, type FormEvent } from 'react'

export const Route = createFileRoute('/_site/products/$productId')({
  component: ProductDetailPage,
})

function ProductDetailPage() {
  const { productId } = Route.useParams()
  const [product, setProduct] = useState(() => mockProducts.find((item) => item.id === productId))
  const { addItem } = useCart()
  const { showToast } = useToast()
  const session = getCustomerSession()
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(0)
  const [allReviews, setAllReviews] = useState(() => getReviews(productId))

  useEffect(() => {
    setAllReviews(getReviews(productId))
  }, [productId])

  useEffect(() => {
    fetch('/api/db/products').then((response) => response.ok ? response.json() : []).then((rows: Array<{ product: typeof mockProducts[number] }>) => {
      const found = rows.find((row) => row.product.id === productId)?.product
      if (found) setProduct(found)
    }).catch(() => undefined)
  }, [productId])

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-brand-navy">Product not found</h1>
        <p className="text-text-muted mt-2">The requested product could not be found.</p>
        <Button href="/shop" variant="primary" className="mt-6">
          Back to shop
        </Button>
      </div>
    )
  }
  const selectedProduct = product

  function handleAddToCart() {
    addItem(selectedProduct)
    showToast(`${selectedProduct.name} added to cart`)
  }

  const productReviews = [...allReviews, ...mockReviews.filter((review) => review.productId === productId || review.productId === undefined)]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)

  function handleShare() {
    if (typeof window === 'undefined') return
    const url = `${window.location.origin}/products/${selectedProduct.id}`
    navigator.clipboard.writeText(url)
    showToast('Product link copied to clipboard')
  }

  async function handleSubmitReview(e: FormEvent) {
    e.preventDefault()

    if (!session) {
      showToast('Please log in or register before leaving a review')
      window.location.assign('/login')
      return
    }

    if (!reviewText.trim() || rating < 1) return

    try {
      const response = await fetch('/api/db/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userEmail: session.email, userName: session.name, productId: selectedProduct.id, rating, comment: reviewText.trim() }) })
      if (!response.ok) throw new Error()
      const review = { id: `${selectedProduct.id}-${Date.now()}`, productId: selectedProduct.id, authorId: session.email, authorName: session.name, comment: reviewText.trim(), rating: rating as 1 | 2 | 3 | 4 | 5, createdAt: new Date().toISOString() }
      addReview(review)
      setAllReviews(getReviews(productId))
      setReviewText(''); setRating(0)
      showToast('Thank you for your review')
    } catch { showToast('We could not save your review right now. Please try again.') }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/shop" className="inline-flex items-center gap-2 text-link-blue hover:underline mb-6">
        <i className="bi bi-arrow-left" /> Back to shop
      </Link>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
        <div className="bg-surface rounded-3xl border border-brand-navy/10 p-6 shadow-card">
          <img src={product.imageUrl} alt={product.name} className="w-full h-72 object-contain rounded-2xl bg-mint-light/40 p-4" />
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent-blue">Featured product</p>
            <h1 className="text-3xl font-bold text-brand-navy mt-2">{product.name}</h1>
            <p className="text-text-muted mt-3">{product.description}</p>
          </div>

          <div className="text-3xl font-extrabold text-brand-navy">SRD {product.price}</div>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={handleAddToCart}>Add to cart</Button>
            <Button variant="outline" href="/checkout">Go to checkout</Button>
          </div>

          <div className="grid gap-3 rounded-2xl border border-brand-navy/10 bg-mint-light/30 p-4 text-sm text-brand-navy">
            <div>
              <h2 className="font-semibold mb-1">Ingredients</h2>
              <p>{product.ingredients?.join(', ') ?? 'Information coming soon.'}</p>
            </div>
            <div>
              <h2 className="font-semibold mb-1">Dosage</h2>
              <p>{product.dosage ?? 'Please follow the instructions on the packaging or consult your pharmacist.'}</p>
            </div>
            <div>
              <h2 className="font-semibold mb-1">How to use</h2>
              <p>{product.usage ?? 'Use as directed by your healthcare professional.'}</p>
            </div>
            <div>
              <h2 className="font-semibold mb-1">Commonly used for</h2>
              <p>{product.conditions?.join(', ') ?? 'General wellness support.'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid lg:grid-cols-[1fr_0.8fr] gap-8">
        <div className="bg-surface rounded-3xl border border-brand-navy/10 p-6 shadow-card">
          <h2 className="text-2xl font-bold text-brand-navy mb-4">Reviews</h2>
          <div className="space-y-4">
            {productReviews.map((review) => (
              <div key={review.id} className="border-b border-brand-navy/10 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-brand-navy">{review.authorName}</span>
                  <StarRating rating={review.rating} readOnly size="sm" />
                </div>
                <p className="text-text-muted mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-3xl border border-brand-navy/10 p-6 shadow-card">
          <h2 className="text-2xl font-bold text-brand-navy mb-4">Leave a review</h2>
          <p className="text-text-muted mb-4">Share your experience with this product and help other customers make an informed choice.</p>

          {!session ? (
            <div className="space-y-3">
              <p className="text-sm text-text-muted">Please log in or register before leaving a review.</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" href="/login">Log in / Register</Button>
                <Button variant="outline" href="/register">Create account</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-brand-navy mb-2">Your rating</label>
                <StarRating rating={rating} onChange={setRating} size="lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-navy mb-2">Your review</label>
                <textarea
                  className="w-full rounded-xl border border-brand-navy/15 bg-surface px-4 py-3 text-brand-navy min-h-[112px]"
                  placeholder="Tell us what you thought about this product..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" variant="primary" disabled={!reviewText.trim() || rating < 1}>
                  Submit review
                </Button>
                <Button variant="outline" onClick={handleShare}>Share product</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
