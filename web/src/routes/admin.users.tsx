import { createFileRoute } from '@tanstack/react-router'
import UserTable from '#/components/admin/UserTable'

export const Route = createFileRoute('/admin/users')({ component: AdminUsersPage })

function AdminUsersPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy mb-1">Manage Users</h1>
          <p className="text-text-muted">View users, change roles, and remove accounts.</p>
        </div>
        <UserTable />
      </div>
    </main>
  )
}
