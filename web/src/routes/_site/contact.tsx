import { createFileRoute } from '@tanstack/react-router'
import ContactForm from '#/components/ContactForm'

export const Route = createFileRoute('/_site/contact')({ component: ContactPage })

function ContactPage() {
  return (
    <div className="bg-mint">
      <div className="container mx-auto px-4 py-16 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-navy">Get in Touch</h1>
          <p className="text-brand-navy/80 mt-3 max-w-md">
            Questions about an order, interested in partnering with us, or want to sponsor a community health drive? We&apos;d love to hear from you.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-brand-navy">
                <i className="bi bi-geo-alt" />
              </span>
              <span className="text-brand-navy">Waterkant 1, Paramaribo, Suriname</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-brand-navy">
                <i className="bi bi-envelope" />
              </span>
              <span className="text-brand-navy">hello@healthease.sr</span>
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  )
}
