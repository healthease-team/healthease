import { prisma } from '#/db'
import type { Product, StockEntry } from '#/lib/types'

export async function getProducts() {
  const rows = await prisma.product.findMany({
    include: { stock: true, category: true },
    orderBy: { createdAt: 'desc' },
  })

  return rows.map((row) => ({
    product: {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      categoryId: row.categoryId,
      subCategory: row.subCategory as Product['subCategory'],
      imageUrl: row.imageUrl,
      ingredients: row.ingredients,
      dosage: row.dosage ?? undefined,
      usage: row.usage ?? undefined,
      conditions: row.conditions,
    } satisfies Product,
    stock: row.stock
      ? ({
          id: row.stock.id,
          pharmacyId: row.stock.pharmacyId,
          productId: row.stock.productId,
          quantity: row.stock.quantity,
        } satisfies StockEntry)
      : null,
  }))
}

export async function createProduct(input: {
  name: string
  description?: string
  price: number
  categoryId: string
  imageUrl: string
  quantity: number
  pharmacyId?: string
}) {
  const product = await prisma.product.create({
    data: {
      name: input.name,
      description: input.description ?? '',
      price: input.price,
      categoryId: input.categoryId,
      imageUrl: input.imageUrl,
      pharmacyId: input.pharmacyId ?? 'ph1',
      stock: {
        create: {
          pharmacyId: input.pharmacyId ?? 'ph1',
          quantity: input.quantity,
        },
      },
    },
    include: { stock: true },
  })

  return product
}

export async function updateProduct(
  productId: string,
  input: {
    name?: string
    description?: string
    price?: number
    categoryId?: string
    imageUrl?: string
    quantity?: number
  }
) {
  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.price !== undefined ? { price: input.price } : {}),
      ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
      ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
    },
    include: { stock: true },
  })

  if (input.quantity !== undefined) {
    await prisma.stockEntry.upsert({
      where: { productId },
      create: { productId, pharmacyId: product.pharmacyId, quantity: input.quantity },
      update: { quantity: input.quantity },
    })
  }

  return prisma.product.findUnique({ where: { id: productId }, include: { stock: true } })
}

export async function deleteProduct(productId: string) {
  await prisma.product.delete({ where: { id: productId } })
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } })
}
