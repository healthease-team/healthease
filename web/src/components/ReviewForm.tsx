import { useState, type FormEvent } from 'react'
import StarRating from './ui/StarRating'
import Button from './ui/Button'
import { inputClass, labelClass } from '#/lib/ui-classes'
import { useToast } from '#/lib/toast-context'

export default function ReviewForm() {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const { showToast } = useToast()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (rating === 0 || !comment.trim()) return
    // TODO(phase-2): POST review to Supabase, tied to authenticated profile
    showToast('Thanks for your review!')
    setRating(0)
    setComment('')
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
        <Button type="submit" variant="primary" disabled={rating === 0 || !comment.trim()}>
          Submit Review
        </Button>
      </form>
    </div>
  )
}
