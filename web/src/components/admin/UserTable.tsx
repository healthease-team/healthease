import { useEffect, useMemo, useState } from 'react'
import Button from '#/components/ui/Button'
import Modal from '#/components/ui/Modal'
import { getCustomerSession } from '#/lib/customer-auth'
import { cardClass, inputClass, labelClass } from '#/lib/ui-classes'
import { useToast } from '#/lib/toast-context'
import type { AdminUser, UserRole } from '#/lib/types'

const ROLES: UserRole[] = ['customer', 'pharmacy', 'admin']
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type SortKey = 'name' | 'email' | 'role' | 'createdAt' | 'orderCount'
type SortDir = 'asc' | 'desc'

const SORT_COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'createdAt', label: 'Joined' },
  { key: 'orderCount', label: 'Orders' },
]

export default function UserTable() {
  const { showToast } = useToast()
  const currentUserId = getCustomerSession()?.id

  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [savingId, setSavingId] = useState<string | null>(null)

  const [pendingRoleChange, setPendingRoleChange] = useState<{ user: AdminUser; newRole: UserRole } | null>(null)
  const [changingRole, setChangingRole] = useState(false)

  const [editTarget, setEditTarget] = useState<AdminUser | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [passwordTarget, setPasswordTarget] = useState<AdminUser | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [resettingPassword, setResettingPassword] = useState(false)

  const [addOpen, setAddOpen] = useState(false)
  const [addName, setAddName] = useState('')
  const [addEmail, setAddEmail] = useState('')
  const [addPassword, setAddPassword] = useState('')
  const [addRole, setAddRole] = useState<UserRole>('customer')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    void loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/db/users')
      if (!res.ok) throw new Error('Failed to load users')
      const data = (await res.json()) as AdminUser[]
      setUsers(data)
    } catch {
      setError('Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return users
    return users.filter((u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term))
  }, [users, search])

  const sortedUsers = useMemo(() => {
    const factor = sortDir === 'asc' ? 1 : -1
    return [...filteredUsers].sort((a, b) => {
      switch (sortKey) {
        case 'createdAt':
          return factor * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        case 'orderCount':
          return factor * (a.orderCount - b.orderCount)
        default:
          return factor * a[sortKey].localeCompare(b[sortKey])
      }
    })
  }, [filteredUsers, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  async function confirmRoleChange() {
    if (!pendingRoleChange) return
    const { user, newRole } = pendingRoleChange
    setChangingRole(true)
    setSavingId(user.id)
    try {
      const res = await fetch('/api/db/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, role: newRole }),
      })
      const data = (await res.json()) as AdminUser | { error: string }
      if (!res.ok) throw new Error('error' in data ? data.error : 'Failed to update user')
      setUsers((prev) => prev.map((u) => (u.id === user.id ? (data as AdminUser) : u)))
      showToast('Role updated', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update user', 'error')
    } finally {
      setChangingRole(false)
      setSavingId(null)
      setPendingRoleChange(null)
    }
  }

  function openEdit(user: AdminUser) {
    setEditName(user.name)
    setEditEmail(user.email)
    setEditTarget(user)
  }

  async function confirmEdit() {
    if (!editTarget) return
    const name = editName.trim()
    const email = editEmail.trim()
    if (!name) {
      showToast('Name cannot be empty.', 'error')
      return
    }
    if (!EMAIL_REGEX.test(email)) {
      showToast('Enter a valid email address.', 'error')
      return
    }
    setSavingEdit(true)
    try {
      const res = await fetch('/api/db/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: editTarget.id, name, email }),
      })
      const data = (await res.json()) as AdminUser | { error: string }
      if (!res.ok) throw new Error('error' in data ? data.error : 'Failed to update user')
      setUsers((prev) => prev.map((u) => (u.id === editTarget.id ? (data as AdminUser) : u)))
      showToast('User updated', 'success')
      setEditTarget(null)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update user', 'error')
    } finally {
      setSavingEdit(false)
    }
  }

  function openPasswordReset(user: AdminUser) {
    setNewPassword('')
    setPasswordTarget(user)
  }

  async function confirmPasswordReset() {
    if (!passwordTarget) return
    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters.', 'error')
      return
    }
    setResettingPassword(true)
    try {
      const res = await fetch('/api/db/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: passwordTarget.id, newPassword }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed to reset password')
      showToast('Password reset', 'success')
      setPasswordTarget(null)
      setNewPassword('')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to reset password', 'error')
    } finally {
      setResettingPassword(false)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/db/users?userId=${encodeURIComponent(deleteTarget.id)}`, { method: 'DELETE' })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed to delete user')
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id))
      showToast('User deleted', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete user', 'error')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  function openAdd() {
    setAddName('')
    setAddEmail('')
    setAddPassword('')
    setAddRole('customer')
    setAddOpen(true)
  }

  async function confirmAdd() {
    const name = addName.trim()
    const email = addEmail.trim()
    if (!name) {
      showToast('Name cannot be empty.', 'error')
      return
    }
    if (!EMAIL_REGEX.test(email)) {
      showToast('Enter a valid email address.', 'error')
      return
    }
    if (addPassword.length < 8) {
      showToast('Password must be at least 8 characters.', 'error')
      return
    }
    setCreating(true)
    try {
      const res = await fetch('/api/db/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: addPassword, role: addRole }),
      })
      const data = (await res.json()) as AdminUser | { error: string }
      if (!res.ok) throw new Error('error' in data ? data.error : 'Failed to create user')
      setUsers((prev) => [data as AdminUser, ...prev])
      showToast('User created', 'success')
      setAddOpen(false)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to create user', 'error')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className={`${cardClass} p-5`}>
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <h2 className="text-lg font-bold text-brand-navy">All Users</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="search"
            placeholder="Search by name or email…"
            className={`${inputClass} max-w-xs`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="primary" className="!px-4 !py-2 text-xs" onClick={openAdd}>
            + Add user
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-text-muted-2 text-sm py-6 text-center">Loading users…</p>
      ) : error ? (
        <div className="text-center py-6">
          <p className="text-red-600 text-sm mb-3">{error}</p>
          <button className="text-xs text-link-blue hover:underline" onClick={() => void loadUsers()}>
            Retry
          </button>
        </div>
      ) : sortedUsers.length === 0 ? (
        <p className="text-text-muted-2 text-sm py-6 text-center">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-text-muted-2 border-b border-brand-navy/10">
                {SORT_COLUMNS.map((col) => (
                  <th key={col.key} className="py-2 pr-4">
                    <button
                      className={`flex items-center gap-1 font-medium hover:text-brand-navy ${sortKey === col.key ? 'text-brand-navy' : ''}`}
                      onClick={() => toggleSort(col.key)}
                    >
                      {col.label}
                      <span className="text-[10px] w-3 inline-block">{sortKey === col.key ? (sortDir === 'asc' ? '▲' : '▼') : ''}</span>
                    </button>
                  </th>
                ))}
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => {
                const isSelf = user.id === currentUserId
                return (
                  <tr key={user.id} className="border-b border-brand-navy/5">
                    <td className="py-2 pr-4 font-medium text-brand-navy">
                      {user.name || '—'} {isSelf && <span className="text-xs text-text-muted-2">(you)</span>}
                    </td>
                    <td className="py-2 pr-4 text-text-muted">{user.email}</td>
                    <td className="py-2 pr-4">
                      <select
                        className="rounded-lg border border-brand-navy/15 bg-surface px-2 py-1 text-sm text-brand-navy disabled:opacity-50"
                        value={user.role}
                        disabled={isSelf || savingId === user.id}
                        onChange={(e) => setPendingRoleChange({ user, newRole: e.target.value as UserRole })}
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 pr-4 text-text-muted">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 pr-4 text-text-muted" title={user.orderCount > 0 ? 'Cannot delete: has orders' : undefined}>
                      {user.orderCount}
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          className="text-xs px-3 py-1.5 rounded-full border border-brand-navy/15 text-brand-navy hover:bg-mint-light"
                          onClick={() => openEdit(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-xs px-3 py-1.5 rounded-full border border-brand-navy/15 text-brand-navy hover:bg-mint-light"
                          onClick={() => openPasswordReset(user)}
                        >
                          Reset password
                        </button>
                        <button
                          className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                          disabled={isSelf}
                          onClick={() => setDeleteTarget(user)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm role change */}
      <Modal open={!!pendingRoleChange} onClose={() => setPendingRoleChange(null)} title="Confirm role change">
        {pendingRoleChange && (
          <p className="text-sm text-text-muted">
            Are you sure you want to change{' '}
            <span className="font-semibold text-brand-navy">{pendingRoleChange.user.name || pendingRoleChange.user.email}</span>'s role from{' '}
            <span className="font-semibold capitalize">{pendingRoleChange.user.role}</span> to{' '}
            <span className="font-semibold capitalize">{pendingRoleChange.newRole}</span>?
          </p>
        )}
        <div className="flex justify-end gap-2 mt-5">
          <button className="text-xs px-4 py-2 rounded-full border border-brand-navy/15 text-brand-navy hover:bg-mint-light" onClick={() => setPendingRoleChange(null)}>
            Cancel
          </button>
          <Button variant="primary" className="!px-4 !py-2 text-xs" disabled={changingRole} onClick={() => void confirmRoleChange()}>
            {changingRole ? 'Saving…' : 'Confirm change'}
          </Button>
        </div>
      </Modal>

      {/* Edit name/email */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit user">
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Name</label>
            <input type="text" className={inputClass} value={editName} onChange={(e) => setEditName(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" className={inputClass} value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button className="text-xs px-4 py-2 rounded-full border border-brand-navy/15 text-brand-navy hover:bg-mint-light" onClick={() => setEditTarget(null)}>
            Cancel
          </button>
          <Button variant="primary" className="!px-4 !py-2 text-xs" disabled={savingEdit} onClick={() => void confirmEdit()}>
            {savingEdit ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete user">
        <p className="text-sm text-text-muted">
          Are you sure you want to delete <span className="font-semibold text-brand-navy">{deleteTarget?.name || deleteTarget?.email}</span>?
          This cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-5">
          <button className="text-xs px-4 py-2 rounded-full border border-brand-navy/15 text-brand-navy hover:bg-mint-light" onClick={() => setDeleteTarget(null)}>
            Cancel
          </button>
          <Button variant="primary" className="!bg-red-600 !border-red-600 hover:!bg-red-700 hover:!border-red-700 !px-4 !py-2 text-xs" disabled={deleting} onClick={() => void confirmDelete()}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </Modal>

      {/* Reset password */}
      <Modal open={!!passwordTarget} onClose={() => setPasswordTarget(null)} title="Reset password">
        <p className="text-sm text-text-muted mb-3">
          Set a new password for <span className="font-semibold text-brand-navy">{passwordTarget?.name || passwordTarget?.email}</span>. Share it with them directly — it is not sent automatically.
        </p>
        <input
          type="password"
          className={inputClass}
          placeholder="New password (min. 8 characters)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
          autoFocus
        />
        <div className="flex justify-end gap-2 mt-5">
          <button className="text-xs px-4 py-2 rounded-full border border-brand-navy/15 text-brand-navy hover:bg-mint-light" onClick={() => setPasswordTarget(null)}>
            Cancel
          </button>
          <Button variant="primary" className="!px-4 !py-2 text-xs" disabled={resettingPassword || newPassword.length < 8} onClick={() => void confirmPasswordReset()}>
            {resettingPassword ? 'Saving…' : 'Reset password'}
          </Button>
        </div>
      </Modal>

      {/* Add user */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add user">
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Name</label>
            <input type="text" className={inputClass} value={addName} onChange={(e) => setAddName(e.target.value)} autoFocus />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" className={inputClass} value={addEmail} onChange={(e) => setAddEmail(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              className={inputClass}
              placeholder="Min. 8 characters"
              value={addPassword}
              onChange={(e) => setAddPassword(e.target.value)}
              minLength={8}
            />
          </div>
          <div>
            <label className={labelClass}>Role</label>
            <select
              className="w-full rounded-xl border border-brand-navy/15 bg-surface px-4 py-2.5 text-brand-navy"
              value={addRole}
              onChange={(e) => setAddRole(e.target.value as UserRole)}
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button className="text-xs px-4 py-2 rounded-full border border-brand-navy/15 text-brand-navy hover:bg-mint-light" onClick={() => setAddOpen(false)}>
            Cancel
          </button>
          <Button variant="primary" className="!px-4 !py-2 text-xs" disabled={creating} onClick={() => void confirmAdd()}>
            {creating ? 'Creating…' : 'Create user'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
