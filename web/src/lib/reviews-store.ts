import type { Review } from './types'

const STORAGE_KEY = 'he_reviews'

function readReviews(): Review[] {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return []

  try {
    return JSON.parse(raw) as Review[]
  } catch {
    return []
  }
}

function writeReviews(reviews: Review[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
}

export function getReviews(productId?: string): Review[] {
  const reviews = readReviews()
  return productId ? reviews.filter((review) => review.productId === productId) : reviews
}

export function addReview(review: Review) {
  const next = [review, ...readReviews()]
  writeReviews(next)
  return next
}

export function clearReviews() {
  writeReviews([])
}
