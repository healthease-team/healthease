import type { ReactNode } from 'react'

export default function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-brand-navy text-center">{title}</h1>
      {subtitle && <p className="text-text-muted text-center text-sm mt-1">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  )
}
