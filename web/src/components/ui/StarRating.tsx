import { useState } from 'react'

interface StarRatingProps {
  rating: number
  onChange?: (rating: number) => void
  readOnly?: boolean
  size?: 'sm' | 'lg'
}

export default function StarRating({ rating, onChange, readOnly = false, size = 'sm' }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null)
  const textSize = size === 'lg' ? 'text-2xl' : 'text-base'
  const display = hover ?? rating

  return (
    <div className={`flex gap-1 ${textSize}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          role={readOnly ? undefined : 'button'}
          aria-label={readOnly ? undefined : `Rate ${n} stars`}
          className={readOnly ? '' : 'cursor-pointer'}
          onMouseEnter={() => !readOnly && setHover(n)}
          onMouseLeave={() => !readOnly && setHover(null)}
          onClick={() => !readOnly && onChange?.(n)}
        >
          <i className={n <= display ? 'bi bi-star-fill text-accent-blue' : 'bi bi-star text-brand-navy/25'} />
        </span>
      ))}
    </div>
  )
}
