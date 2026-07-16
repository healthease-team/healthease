import { createContext, useContext, useState, type ReactNode } from 'react'

interface LocationsModalContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
}

const LocationsModalContext = createContext<LocationsModalContextValue | null>(null)

export function LocationsModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <LocationsModalContext.Provider
      value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}
    >
      {children}
    </LocationsModalContext.Provider>
  )
}

export function useLocationsModal() {
  const ctx = useContext(LocationsModalContext)
  if (!ctx) throw new Error('useLocationsModal must be used within a LocationsModalProvider')
  return ctx
}
