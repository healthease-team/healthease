import { createFileRoute } from '@tanstack/react-router'
import AccountHeader from '#/components/AccountHeader'
import OrderHistoryList from '#/components/OrderHistoryList'
import ReviewForm from '#/components/ReviewForm'
import NotificationsList from '#/components/NotificationsList'
import { getCustomerSession } from '#/lib/customer-auth'

export const Route = createFileRoute('/account')({ component: AccountPage })

function AccountPage() {
  const session = getCustomerSession()

  if (!session || session.role !== 'customer') {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center px-4">
        <div className="bg-surface rounded-2xl p-8 text-center shadow-card">
          <h1 className="text-2xl font-bold text-brand-navy">Access restricted</h1>
          <p className="text-text-muted mt-2">Please log in with a customer account to view your orders.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-page-bg">
      <AccountHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy mb-4">My Orders</h1>
            <OrderHistoryList />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-navy mb-4">Share Your Experience</h1>
            <ReviewForm />
            <NotificationsList />
          </div>
        </div>
      </main>
    </div>
  )
}
