import { useEffect, useState } from 'react'

interface Notification { id: string; title: string; message: string; createdAt: string }

export default function NotificationsList() {
  const [items, setItems] = useState<Notification[]>([])
  useEffect(() => { fetch('/api/db/notifications').then((response) => response.ok ? response.json() : []).then(setItems).catch(() => undefined) }, [])
  return <section className="mt-8"><h2 className="text-xl font-bold text-brand-navy mb-3"><i className="bi bi-bell" /> Notifications</h2>{items.length ? <div className="space-y-2">{items.map((item) => <div key={item.id} className="rounded-xl border border-brand-navy/10 bg-surface p-3"><div className="font-semibold text-brand-navy">{item.title}</div><p className="text-sm text-text-muted">{item.message}</p><time className="text-xs text-text-muted-2">{new Date(item.createdAt).toLocaleString()}</time></div>)}</div> : <p className="text-sm text-text-muted">Order updates will appear here.</p>}</section>
}
