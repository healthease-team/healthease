import { useState } from 'react'
import type { FaqItem } from '#/lib/types'

export default function Accordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="divide-y divide-brand-navy/10 rounded-2xl border border-brand-navy/10 bg-surface overflow-hidden">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div key={item.question}>
            <button
              type="button"
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-brand-navy hover:bg-mint-light/50 transition-colors"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              {item.question}
              <i className={`bi ${isOpen ? 'bi-dash-circle' : 'bi-plus-circle'} text-accent-blue shrink-0`} />
            </button>
            {isOpen && (
              <div className="px-5 pb-4 text-text-muted animate-fade-in-up">{item.answer}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
