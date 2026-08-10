import { prisma } from '#/db'
import type { AdminPharmacy, PharmacyStatus } from '#/lib/types'

function mapPharmacy(
  row: { id: string; name: string; address: string; ownerEmail: string | null; status: string; createdAt: Date },
  productCount: number
): AdminPharmacy {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    ownerEmail: row.ownerEmail ?? undefined,
    status: row.status as PharmacyStatus,
    createdAt: row.createdAt.toISOString(),
    productCount,
  }
}

export async function listPharmacies(): Promise<AdminPharmacy[]> {
  const [rows, counts] = await Promise.all([
    prisma.pharmacy.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.product.groupBy({ by: ['pharmacyId'], _count: { id: true } }),
  ])
  const countByPharmacy = new Map(counts.map((c) => [c.pharmacyId, c._count.id]))
  return rows.map((row) => mapPharmacy(row, countByPharmacy.get(row.id) ?? 0))
}

export async function updatePharmacyStatus(id: string, status: PharmacyStatus): Promise<AdminPharmacy> {
  const row = await prisma.pharmacy.update({ where: { id }, data: { status } })
  const productCount = await prisma.product.count({ where: { pharmacyId: id } })
  return mapPharmacy(row, productCount)
}
