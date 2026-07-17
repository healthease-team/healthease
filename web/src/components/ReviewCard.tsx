import StarRating from './ui/StarRating'
import type { Review } from '#/lib/types'

export default function ReviewCard({ review }: { review: Review }) {
  const initials = review.authorName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-6 w-72 shrink-0 flex flex-col gap-3">
      <i className="bi bi-quote text-3xl text-accent-blue" />
      <p className="text-text-muted text-sm flex-1">{review.comment}</p>
      <StarRating rating={review.rating} readOnly />
      <div className="flex items-center gap-3 mt-2">
        <span className="w-9 h-9 rounded-full bg-mint-light text-brand-navy flex items-center justify-center text-xs font-bold">
          {initials}
        </span>
        <span className="text-sm font-semibold text-brand-navy">{review.authorName}</span>
      </div>
    </div>
  )
}
