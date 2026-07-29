import { createFileRoute } from '@tanstack/react-router'

const sections = [
  {
    title: '1. Orders',
    body: 'By placing an order on HealthEase, you confirm that all information provided, including prescription and identification documents, is accurate and belongs to you or the person you are ordering for.',
  },
  {
    title: '2. Delivery',
    body: 'Delivery is available within 15km of the fulfilling pharmacy. Delivery fees are calculated based on distance and displayed before checkout. Pickup orders must be collected within the selected time window.',
  },
  {
    title: '3. Privacy',
    body: 'Your prescription and ID documents are used solely to verify and fulfill your order, and are only accessible to you and the fulfilling pharmacy.',
  },
  {
    title: '4. Returns',
    body: 'Due to the nature of pharmaceutical products, items cannot be returned once delivered or picked up, except in the case of a fulfillment error on our part.',
  },
  {
    title: '5. Contact',
    body: 'For any questions about these terms, please reach out via our Contact page and our team will respond promptly.',
  },
]

export const Route = createFileRoute('/_site/terms')({ component: TermsPage })

function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-8">
        <h1 className="text-3xl font-extrabold text-brand-navy mb-8">Terms &amp; Conditions</h1>
        <div className="space-y-6">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-lg font-bold text-brand-navy mb-1">{s.title}</h2>
              <p className="text-text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
