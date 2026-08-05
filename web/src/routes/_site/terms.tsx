import { createFileRoute } from '@tanstack/react-router'

const sections = [
  {
    title: '1. Orders',
    body: 'By placing an order through HealthEase, you confirm that the information you provide is accurate, complete, and authorised for the person receiving the order. Prescription and identification documents are required for applicable orders and will be reviewed by the selected pharmacy.',
  },
  {
    title: '2. Delivery and pickup',
    body: 'Delivery is available within the service range of the selected pharmacy and fees are calculated before checkout. Pickup orders should be collected from the pharmacy as soon as possible after confirmation, and delays may occur during busy periods.',
  },
  {
    title: '3. Privacy and safety',
    body: 'Your personal information, prescription details, and identification documents are handled with care and used only to process and verify your order. We do not share them with third parties except the fulfilment pharmacy and authorised service providers.',
  },
  {
    title: '4. Returns and refunds',
    body: 'Because many items are health-related, returns are generally not possible once an order has been fulfilled. If an error occurs on our side or the wrong product is delivered, please contact us as soon as possible so we can help resolve it.',
  },
  {
    title: '5. Contact',
    body: 'If you have questions about your order, delivery, or these terms, please contact us through the Contact page and our team will assist you promptly.',
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
