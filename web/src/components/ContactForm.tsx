import { useState, type FormEvent } from 'react'
import Button from './ui/Button'
import { inputClass, labelClass } from '#/lib/ui-classes'
import { useToast } from '#/lib/toast-context'
import type { MessageType } from '#/lib/types'

export default function ContactForm() {
  const { showToast } = useToast()
  const [type, setType] = useState<MessageType>('consulting')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    // TODO(phase-2): insert into Supabase `messages`, trigger admin email notification
    setTimeout(() => {
      setLoading(false)
      showToast('Message sent — we\'ll get back to you soon!')
      setName('')
      setEmail('')
      setLocation('')
      setMessage('')
    }, 600)
  }

  return (
    <div className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-6">
      <div className="flex rounded-full border-2 border-brand-navy overflow-hidden w-fit mb-5">
        {(['consulting', 'sponsoring'] as MessageType[]).map((t) => (
          <button
            key={t}
            type="button"
            className={`px-5 py-2 text-sm font-semibold capitalize transition-colors ${
              type === t ? 'bg-brand-navy text-white dark:text-slate-900' : 'bg-surface text-brand-navy'
            }`}
            onClick={() => setType(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Name</label>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Message</label>
          <textarea
            className={`${inputClass} min-h-[120px] resize-none`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Sending…' : 'Send Message'}
        </Button>
      </form>
    </div>
  )
}
