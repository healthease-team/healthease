import { createFileRoute } from '@tanstack/react-router'
import AccountHeader from '#/components/AccountHeader'
import OrderHistoryList from '#/components/OrderHistoryList'
import ReviewForm from '#/components/ReviewForm'

export const Route = createFileRoute('/account')({ component: AccountPage })

function AccountPage() {
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
          </div>
        </div>
      </main>
    </div>
  )
}
