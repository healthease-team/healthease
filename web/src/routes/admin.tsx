import { Outlet, createFileRoute } from '@tanstack/react-router'
import AdminHeader from '#/components/AdminHeader'
import { getCustomerSession } from '#/lib/customer-auth'

export const Route = createFileRoute('/admin')({ component: AdminLayout })

function AdminLayout() {
  const session = getCustomerSession()

  if (!session || session.role !== 'admin') {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center px-4">
        <div className="bg-surface rounded-2xl p-8 text-center shadow-card">
          <h1 className="text-2xl font-bold text-brand-navy">Access restricted</h1>
          <p className="text-text-muted mt-2">Only administrators can access this area.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-page-bg">
      <AdminHeader />
      <Outlet />
    </div>
  )
}
