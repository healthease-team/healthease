import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import StatusBadge from '#/components/ui/StatusBadge'
import { useToast } from '#/lib/toast-context'
import type { AdminPharmacy, Message, Order } from '#/lib/types'

export const Route = createFileRoute('/admin/')({ component: AdminOverviewPage })

function AdminOverviewPage() {
  const { showToast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [messagesLoading, setMessagesLoading] = useState(true)
  const [messagesError, setMessagesError] = useState<string | null>(null)

  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  const [pharmacies, setPharmacies] = useState<AdminPharmacy[]>([])
  const [pharmaciesLoading, setPharmaciesLoading] = useState(true)
  const [pharmaciesError, setPharmaciesError] = useState<string | null>(null)

  useEffect(() => {
    void loadMessages()
    void loadOrders()
    void loadPharmacies()
  }, [])

  async function loadMessages() {
    setMessagesLoading(true)
    setMessagesError(null)
    try {
      const res = await fetch('/api/db/messages')
      if (!res.ok) throw new Error('Failed to load messages')
      setMessages((await res.json()) as Message[])
    } catch {
      setMessagesError('Failed to load messages.')
    } finally {
      setMessagesLoading(false)
    }
  }

  async function loadOrders() {
    setOrdersLoading(true)
    setOrdersError(null)
    try {
      const res = await fetch('/api/db/orders')
      if (!res.ok) throw new Error('Failed to load orders')
      setOrders((await res.json()) as Order[])
    } catch {
      setOrdersError('Failed to load orders.')
    } finally {
      setOrdersLoading(false)
    }
  }

  async function loadPharmacies() {
    setPharmaciesLoading(true)
    setPharmaciesError(null)
    try {
      const res = await fetch('/api/db/pharmacies')
      if (!res.ok) throw new Error('Failed to load pharmacies')
      setPharmacies((await res.json()) as AdminPharmacy[])
    } catch {
      setPharmaciesError('Failed to load pharmacies.')
    } finally {
      setPharmaciesLoading(false)
    }
  }

  async function markRead(id: string) {
    try {
      const res = await fetch('/api/db/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = (await res.json()) as Message | { error: string }
      if (!res.ok) throw new Error('error' in data ? data.error : 'Failed to update message')
      setMessages((prev) => prev.map((m) => (m.id === id ? (data as Message) : m)))
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to mark message as read', 'error')
    }
  }

  async function updatePharmacyStatus(id: string, status: 'active' | 'rejected') {
    try {
      const res = await fetch('/api/db/pharmacies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      const data = (await res.json()) as AdminPharmacy | { error: string }
      if (!res.ok) throw new Error('error' in data ? data.error : 'Failed to update pharmacy')
      setPharmacies((prev) => prev.map((p) => (p.id === id ? (data as AdminPharmacy) : p)))
      showToast(status === 'active' ? 'Pharmacy approved' : 'Pharmacy registration rejected', status === 'active' ? 'success' : 'info')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update pharmacy', 'error')
    }
  }

  function approvePharmacy(id: string) {
    void updatePharmacyStatus(id, 'active')
  }

  function rejectPharmacy(id: string) {
    void updatePharmacyStatus(id, 'rejected')
  }

  const pendingPharmacies = pharmacies.filter((p) => p.status === 'pending')
  const activePharmacies = pharmacies.filter((p) => p.status === 'active')

  return (
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
            {messagesLoading ? (
              <p className="text-text-muted-2 text-sm py-6 text-center">Loading messages…</p>
            ) : messagesError ? (
              <div className="text-center py-6">
                <p className="text-red-600 text-sm mb-3">{messagesError}</p>
                <button className="text-xs text-link-blue hover:underline" onClick={() => void loadMessages()}>
                  Retry
                </button>
              </div>
            ) : messages.length === 0 ? (
              <p className="text-text-muted-2 text-sm py-6 text-center">No messages yet.</p>
            ) : (
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
                        <button className="text-xs text-link-blue hover:underline" onClick={() => void markRead(m.id)}>
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending pharmacy approvals */}
          <div className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-5">
            <h2 className="text-lg font-bold text-brand-navy mb-4">Pending Pharmacy Approvals</h2>
            {pharmaciesLoading ? (
              <p className="text-text-muted-2 text-sm py-6 text-center">Loading pharmacies…</p>
            ) : pharmaciesError ? (
              <div className="text-center py-6">
                <p className="text-red-600 text-sm mb-3">{pharmaciesError}</p>
                <button className="text-xs text-link-blue hover:underline" onClick={() => void loadPharmacies()}>
                  Retry
                </button>
              </div>
            ) : pendingPharmacies.length === 0 ? (
              <p className="text-text-muted-2 text-sm">No pending applications.</p>
            ) : (
              <div className="space-y-3">
                {pendingPharmacies.map((p) => (
                  <div key={p.id} className="border border-brand-navy/10 rounded-xl p-3">
                    <div className="text-sm font-semibold text-brand-navy">{p.name}</div>
                    <div className="text-xs text-text-muted-2">{p.ownerEmail ?? 'No owner email'} · {p.address}</div>
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

        {/* Cross-pharmacy oversight */}
        <div className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-5">
          <h2 className="text-lg font-bold text-brand-navy mb-4">Cross-Pharmacy Overview</h2>
          {pharmaciesLoading ? (
            <p className="text-text-muted-2 text-sm py-6 text-center">Loading pharmacies…</p>
          ) : pharmaciesError ? (
            <div className="text-center py-6">
              <p className="text-red-600 text-sm mb-3">{pharmaciesError}</p>
              <button className="text-xs text-link-blue hover:underline" onClick={() => void loadPharmacies()}>
                Retry
              </button>
            </div>
          ) : activePharmacies.length === 0 ? (
            <p className="text-text-muted-2 text-sm py-6 text-center">No active pharmacies yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-text-muted-2 border-b border-brand-navy/10">
                    <th className="py-2 pr-4">Pharmacy</th>
                    <th className="py-2 pr-4">Address</th>
                    <th className="py-2 pr-4">Orders</th>
                    <th className="py-2 pr-4">Revenue (SRD)</th>
                    <th className="py-2">Products Listed</th>
                  </tr>
                </thead>
                <tbody>
                  {activePharmacies.map((pharmacy) => {
                    const pharmacyOrders = orders.filter((o) => o.pharmacyId === pharmacy.id)
                    const revenue = pharmacyOrders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.totalAmount : 0), 0)
                    return (
                      <tr key={pharmacy.id} className="border-b border-brand-navy/5">
                        <td className="py-2 pr-4 font-medium text-brand-navy">{pharmacy.name}</td>
                        <td className="py-2 pr-4 text-text-muted">{pharmacy.address}</td>
                        <td className="py-2 pr-4 text-text-muted">{pharmacyOrders.length}</td>
                        <td className="py-2 pr-4 text-text-muted">{revenue.toFixed(2)}</td>
                        <td className="py-2 text-text-muted">{pharmacy.productCount}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent orders across all pharmacies */}
        <div className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-5">
          <h2 className="text-lg font-bold text-brand-navy mb-4">All Orders</h2>
          {ordersLoading ? (
            <p className="text-text-muted-2 text-sm py-6 text-center">Loading orders…</p>
          ) : ordersError ? (
            <div className="text-center py-6">
              <p className="text-red-600 text-sm mb-3">{ordersError}</p>
              <button className="text-xs text-link-blue hover:underline" onClick={() => void loadOrders()}>
                Retry
              </button>
            </div>
          ) : orders.length === 0 ? (
            <p className="text-text-muted-2 text-sm py-6 text-center">No orders yet.</p>
          ) : (
            <div className="space-y-2">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b border-brand-navy/5 py-2 last:border-0">
                  <div>
                    <span className="text-sm font-medium text-brand-navy">Order #{order.id}</span>
                    <span className="text-xs text-text-muted-2 ml-2">{order.customerName}</span>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
