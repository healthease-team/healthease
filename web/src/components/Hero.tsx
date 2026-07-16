import Button from './ui/Button'
import { useLocationsModal } from '#/lib/locations-modal-context'

export default function Hero() {
  const { open: openLocations } = useLocationsModal()

  return (
    <section className="bg-mint min-h-screen flex items-center py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-7/12 text-center md:text-left animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-navy leading-tight">
              Your trusted <br />
              <span className="text-accent-blue">Online Drugstore</span> <br />
              For Every Need
            </h1>
            <p className="text-brand-navy/80 text-lg mt-4 mb-6">
              Your one-stop pharmacy. Shop smart, live well, feel better.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <Button variant="primary" className="hover:scale-105" onClick={openLocations}>
                Locations
              </Button>
              <Button variant="outline" className="hover:scale-105" href="/shop">
                Shop Now
              </Button>
            </div>
          </div>
          <div className="md:w-5/12 mt-8 md:mt-0 w-full animate-fade-in [animation-delay:200ms]">
            <div className="bg-mint-light rounded-3xl p-8 min-h-[200px] flex flex-col items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-surface flex items-center justify-center">
                <img
                  src="/images/homepage_healthcare.png"
                  alt="Pharmacy"
                  width={130}
                  height={110}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
