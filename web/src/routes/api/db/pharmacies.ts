import { createFileRoute } from '@tanstack/react-router'
import { listPharmacies, updatePharmacyStatus } from '#/lib/api/pharmacies'
import { requireSession } from '#/lib/auth'
import type { PharmacyStatus } from '#/lib/types'

const VALID_STATUSES: PharmacyStatus[] = ['pending', 'active', 'rejected']

export const Route = createFileRoute('/api/db/pharmacies')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          await requireSession(request, 'admin')
          const pharmacies = await listPharmacies()
          return Response.json(pharmacies)
        } catch (error) {
          if (error instanceof Response) return error
          console.error('GET pharmacies failed:', error)
          return Response.json({ error: 'Failed to fetch pharmacies' }, { status: 500 })
        }
      },
      PATCH: async ({ request }) => {
        try {
          await requireSession(request, 'admin')
          const body = (await request.json()) as { id?: string; status?: string }
          if (!body.id || !body.status) {
            return Response.json({ error: 'Missing id or status' }, { status: 400 })
          }
          if (!VALID_STATUSES.includes(body.status as PharmacyStatus)) {
            return Response.json({ error: 'Invalid status' }, { status: 400 })
          }
          const updated = await updatePharmacyStatus(body.id, body.status as PharmacyStatus)
          return Response.json(updated)
        } catch (error) {
          if (error instanceof Response) return error
          console.error('PATCH pharmacy failed:', error)
          return Response.json({ error: 'Failed to update pharmacy' }, { status: 500 })
        }
      },
    },
  },
})
