import { createFileRoute } from '@tanstack/react-router'
import ReviewCard from '#/components/ReviewCard'
import { reviews } from '#/lib/mock-data'

export const Route = createFileRoute('/_site/testimonials')({ component: TestimonialsPage })

function TestimonialsPage() {
  return (
    <div>
      <section className="bg-mint py-16 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-navy">What Our Customers Say</h1>
        <p className="text-brand-navy/80 mt-2 max-w-xl mx-auto">
          Real stories from people who trust HealthEase with their everyday health needs.
        </p>
      </section>

      <div className="container mx-auto px-4 py-10 overflow-x-auto">
        <div className="flex gap-4 w-max">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  )
}
