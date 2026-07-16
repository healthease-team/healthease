import { Outlet, createFileRoute } from '@tanstack/react-router'
import Navbar from '#/components/Navbar'
import Footer from '#/components/Footer'
import LocationsModal from '#/components/LocationsModal'

export const Route = createFileRoute('/_site')({ component: SiteLayout })

function SiteLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <LocationsModal />
    </>
  )
}
