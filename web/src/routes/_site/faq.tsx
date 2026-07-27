import { createFileRoute } from '@tanstack/react-router'
import Accordion from '#/components/ui/Accordion'
import Button from '#/components/ui/Button'
import { faqItems } from '#/lib/mock-data'

export const Route = createFileRoute('/_site/faq')({ component: FaqPage })

function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-16 grid lg:grid-cols-2 gap-10 items-start">
      <div>
        <span className="w-12 h-12 rounded-full bg-mint-light flex items-center justify-center text-brand-navy text-xl mb-4">
          <i className="bi bi-question-circle" />
        </span>
        <h1 className="text-3xl font-extrabold text-brand-navy mb-3">Frequently Asked Questions</h1>
        <p className="text-text-muted mb-8">
          Everything you need to know about ordering, delivery, and getting your pharmacy on HealthEase.
        </p>
        <div className="bg-gradient-to-br from-brand-navy to-brand-navy/80 rounded-2xl p-6 text-white dark:text-slate-900">
          <h2 className="text-lg font-bold mb-2">Still have questions?</h2>
          <p className="text-white/80 dark:text-slate-900/70 text-sm mb-4">Our team is happy to help with anything not covered here.</p>
          <Button variant="primary" href="/contact">
            Contact Us
          </Button>
        </div>
      </div>
      <Accordion items={faqItems} />
    </div>
  )
}
