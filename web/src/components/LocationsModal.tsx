import Modal from './ui/Modal'
import { useLocationsModal } from '#/lib/locations-modal-context'

const locations = [
  { name: 'Central Pharmacy - Paramaribo', address: 'Waterkant 1, Paramaribo', phone: '+597 421 234', lat: 5.852, lng: -55.2038 },
  { name: 'Wanica Health - Lelydorp', address: 'Hoofdstraat 5, Lelydorp', phone: '+597 327 456', lat: 5.7, lng: -55.2333 },
  { name: 'Mac Donald - Zorg & Hoop', address: 'Madeliefjes Straat 31, Paramaribo', phone: '+597 465 789', lat: 5.828, lng: -55.176 },
  { name: 'Jong A Liem - Paramaribo', address: 'Johannes Mungrastraat 59, Paramaribo', phone: '+597 402 913', lat: 5.834, lng: -55.161 },
  { name: 'Apotheek FUNG - Nickerie', address: 'Waterloostraat 15, Nieuw Nickerie', phone: '+597 231 567', lat: 5.95, lng: -56.9667 },
  { name: 'Tjong Akiet - Wanica', address: 'Martin Luther Kingweg 91, Wanica', phone: '+597 368 240', lat: 5.744, lng: -55.203 },
]

export default function LocationsModal() {
  const { isOpen, close } = useLocationsModal()

  return (
    <Modal open={isOpen} onClose={close} title="Apotheken in Suriname" maxWidthClass="max-w-6xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((location) => (
          <div
            key={location.name}
            className="bg-surface rounded-xl border border-brand-navy/10 shadow-sm flex flex-col"
          >
            <div className="bg-mint-light/60 h-20 flex items-center justify-center rounded-t-xl">
              <i className="bi bi-hospital text-3xl text-brand-navy" />
            </div>
            <div className="p-4 flex flex-col gap-2 flex-1">
              <div className="font-semibold text-brand-navy leading-snug">{location.name}</div>
              <div className="flex items-start gap-2 text-sm text-text-muted">
                <i className="bi bi-geo-alt mt-0.5 shrink-0" />
                <span>{location.address}</span>
              </div>
              <a
                href={`tel:${location.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2 text-sm text-link-blue hover:underline w-fit"
              >
                <i className="bi bi-telephone" />
                {location.phone}
              </a>
              <a
                href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                target="_blank"
                rel="noreferrer"
                className="mt-auto pt-2 inline-flex items-center gap-2 text-sm text-brand-navy hover:text-accent-blue"
              >
                <i className="bi bi-map" /> Get Directions
              </a>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}
