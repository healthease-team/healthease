import { createFileRoute } from '@tanstack/react-router'
import { DashboardProvider } from '#/lib/dashboard-context'
import DashboardHeader from '#/components/dashboard/DashboardHeader'
import StockManager from '#/components/dashboard/StockManager'
import RecentOrders from '#/components/dashboard/RecentOrders'

export const Route = createFileRoute('/pharmacy/dashboard')({ component: PharmacyDashboardPage })

function PharmacyDashboardPage() {
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
