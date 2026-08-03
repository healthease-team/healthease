import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import AdminHeader from '#/components/AdminHeader'
import { messages as mockMessages } from '#/lib/mock-data'
import { useToast } from '#/lib/toast-context'
import type { Message } from '#/lib/types'

export const Route = createFileRoute('/admin')({ component: AdminPage })

interface PendingPharmacy {
  id: string
  name: string
  ownerEmail: string
  address: string
}

const initialPendingPharmacies: PendingPharmacy[] = [
  { id: 'pending-1', name: 'Riverside Apotheek', ownerEmail: 'owner@riverside.sr', address: 'Coppenamestraat 8, Paramaribo' },
  { id: 'pending-2', name: 'Sunrise Health Corner', ownerEmail: 'contact@sunrisehealth.sr', address: 'Anton Dragtenweg 22, Paramaribo' },
]

function AdminPage() {
  const { showToast } = useToast()
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [pendingPharmacies, setPendingPharmacies] = useState(initialPendingPharmacies)

  function markRead(id: string) {
    // TODO(phase-2): PATCH messages.read_at via Supabase
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, readAt: new Date().toISOString() } : m)))
  }

  function approvePharmacy(id: string) {
    // TODO(phase-2): flip pharmacy profile from pending to active in Supabase, trigger approval email
    setPendingPharmacies((prev) => prev.filter((p) => p.id !== id))
    showToast('Pharmacy approved')
  }

  function rejectPharmacy(id: string) {
    setPendingPharmacies((prev) => prev.filter((p) => p.id !== id))
    showToast('Pharmacy registration rejected', 'info')
  }

  return (
    <div className="min-h-screen bg-page-bg">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy mb-1">Admin Overview</h1>
            <p className="text-text-muted">Contact inbox, pharmacy approvals, and cross-pharmacy oversight.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* Contact inbox */}
            <div className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-5">
              <h2 className="text-lg font-bold text-brand-navy mb-4">Contact Inbox</h2>
              <div className="space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`border rounded-xl p-3 ${m.readAt ? 'border-brand-navy/10' : 'border-accent-blue/50 bg-mint-light/30'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-brand-navy">{m.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-mint-light text-brand-navy capitalize">{m.type}</span>
                    </div>
                    <p className="text-sm text-text-muted mt-1">{m.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-text-muted-2">{m.email} · {m.location}</span>
                      {!m.readAt && (
                        <button className="text-xs text-link-blue hover:underline" onClick={() => markRead(m.id)}>
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending pharmacy approvals */}
            <div className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-5">
              <h2 className="text-lg font-bold text-brand-navy mb-4">Pending Pharmacy Approvals</h2>
              {pendingPharmacies.length === 0 ? (
                <p className="text-text-muted-2 text-sm">No pending applications.</p>
              ) : (
                <div className="space-y-3">
                  {pendingPharmacies.map((p) => (
                    <div key={p.id} className="border border-brand-navy/10 rounded-xl p-3">
                      <div className="text-sm font-semibold text-brand-navy">{p.name}</div>
                      <div className="text-xs text-text-muted-2">{p.ownerEmail} · {p.address}</div>
                      <div className="flex gap-2 mt-2">
                        <button
                          className="text-xs px-3 py-1.5 rounded-full bg-accent-blue text-white hover:bg-brand-navy transition-colors"
                          onClick={() => approvePharmacy(p.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                          onClick={() => rejectPharmacy(p.id)}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
