import { createFileRoute } from '@tanstack/react-router'
import { DashboardProvider } from '#/lib/dashboard-context'
import { getCustomerSession } from '#/lib/customer-auth'
import DashboardHeader from '#/components/dashboard/DashboardHeader'
import StockManager from '#/components/dashboard/StockManager'
import RecentOrders from '#/components/dashboard/RecentOrders'

export const Route = createFileRoute('/pharmacy/dashboard')({ component: PharmacyDashboardPage })

function PharmacyDashboardPage() {
  const session = getCustomerSession()

  if (!session || session.role !== 'pharmacy') {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center px-4">
        <div className="bg-surface rounded-2xl p-8 text-center shadow-card">
          <h1 className="text-2xl font-bold text-brand-navy">Access restricted</h1>
          <p className="text-text-muted mt-2">Please log in with a pharmacy account to access the dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-page-bg">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <StockManager />
            <RecentOrders />
          </div>
        </main>
      </div>
    </DashboardProvider>
  )
}
