import { useState, type FormEvent } from 'react'
import StarRating from './ui/StarRating'
import Button from './ui/Button'
import { inputClass, labelClass } from '#/lib/ui-classes'
import { useToast } from '#/lib/toast-context'
import { getCustomerSession } from '#/lib/customer-auth'

export default function ReviewForm() {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()
  const session = getCustomerSession()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (rating === 0 || !comment.trim() || !session) return

    setLoading(true)
    try {
      const response = await fetch('/api/db/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: session.email,
          productId: 'account-review',
          rating,
          comment: comment.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Unable to save review')
      }

      showToast('Thanks for your review!')
      setRating(0)
      setComment('')
    } catch {
      showToast('We could not save your review right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-5">
      <h2 className="text-lg font-bold text-brand-navy mb-4">Leave a Review</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Your Rating</label>
          <StarRating rating={rating} onChange={setRating} size="lg" />
        </div>
        <div>
          <label className={labelClass}>Your Review</label>
          <textarea
            className={`${inputClass} min-h-[100px] resize-none`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience..."
          />
        </div>
        <Button type="submit" variant="primary" disabled={rating === 0 || !comment.trim() || loading}>
          {loading ? 'Submitting…' : 'Submit Review'}
        </Button>
      </form>
    </div>
  )
}
