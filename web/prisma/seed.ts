import { PrismaClient } from '../src/generated/prisma/client.js'

import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  const categories = [
    ['personal-care', 'Personal care', 'personal-care', '/images/personal_care.png'],
    ['diabetic-care', 'Diabetic Care', 'diabetic-care', '/images/diabetic_care.png'],
    ['supplements', 'Supplements', 'supplements', '/images/supplements.png'],
    ['devices', 'Devices', 'devices', '/images/medical_devices.png'],
    ['vitamins', 'Vitamins', 'vitamins', '/images/products/vitamins1.png'],
    ['first-aid', 'First Aid', 'first-aid', '/images/first_aid_basics.png'],
    ['allergy', 'Allergy', 'allergy', '/images/allergy.png'],
    ['immune-support', 'Immune Support', 'immune-support', '/images/immune_support.png'],
    ['pain-fever', 'Pain & Fever Relief', 'pain-fever', '/images/pain_and_fever_relief.png'],
  ] as const

  await Promise.all(categories.map(([id, name, slug, image]) => prisma.category.upsert({
    where: { id }, create: { id, name, slug, image }, update: { name, slug, image },
  })))

  const products = [
    ['alcohol-swabs', 'Alcohol Swabs', 'Individually wrapped antiseptic swabs for quick clean-ups.', 15, 'first-aid', '/images/products/alcohol-swabs.png', 80],
    ['allergy-relief', 'Allergy Relief Tablets', 'Fast-acting antihistamine for seasonal allergies.', 45, 'allergy', '/images/products/allergy1.png', 42],
    ['aloe-vera-gel', 'Aloe Vera Gel', 'Soothing gel for skin hydration and after-sun care.', 35, 'personal-care', '/images/products/aloevera.png', 35],
    ['adhesive-bandages', 'Adhesive Bandages', 'Flexible fabric bandages in assorted sizes.', 20, 'first-aid', '/images/products/bandages.png', 120],
    ['digital-thermometer', 'Digital Thermometer', 'Fast and accurate temperature readings with fever alert.', 120, 'devices', '/images/products/device1.png', 18],
    ['blood-pressure-monitor', 'Blood Pressure Monitor', 'Automatic upper-arm monitor with memory storage.', 350, 'devices', '/images/products/device2.png', 12],
    ['glucose-tablets', 'Glucose Tablets', 'Fast-acting glucose for low blood sugar relief.', 30, 'diabetic-care', '/images/products/glucose_tablets.png', 50],
    ['glucose-test-strips', 'Glucose Test Strips', 'Compatible test strips for daily monitoring.', 110, 'diabetic-care', '/images/products/teststrips.png', 28],
    ['multivitamin-complex', 'Multivitamin Complex', 'Daily multivitamin with essential minerals.', 85, 'supplements', '/images/products/sup2.png', 44],
    ['omega-3', 'Omega-3 Fish Oil', 'Supports heart and brain health.', 95, 'supplements', '/images/products/sup3.png', 32],
    ['vitamin-c', 'Vitamin C Chewables', 'Immune support in a tasty chewable tablet.', 50, 'immune-support', '/images/products/supplements1.png', 60],
    ['pain-fever-tablets', 'Pain & Fever Relief Tablets', 'Fast relief from common pain and fever symptoms.', 28, 'pain-fever', '/images/pain_and_fever_relief.png', 75],
  ] as const

  await Promise.all(products.map(async ([id, name, description, price, categoryId, imageUrl, quantity]) => {
    await prisma.product.upsert({
      where: { id },
      create: { id, name, description, price, categoryId, imageUrl, pharmacyId: 'ph1', stock: { create: { pharmacyId: 'ph1', quantity } } },
      update: { name, description, price, categoryId, imageUrl, stock: { upsert: { create: { pharmacyId: 'ph1', quantity }, update: { quantity } } } },
    })
  }))

  const demoCustomer = await prisma.user.upsert({
    where: { email: 'customer@healthease.com' },
    create: { email: 'customer@healthease.com', name: 'Denver', role: 'customer' },
    update: { name: 'Denver', role: 'customer' },
  })

  await prisma.order.upsert({
    where: { id: 'sample-delivery-order' },
    create: {
      id: 'sample-delivery-order', userId: demoCustomer.id, pharmacyId: 'ph1', customerName: 'Denver', email: demoCustomer.email, phone: '+597 123 4567',
      deliveryMethod: 'delivery', deliveryAddress: 'Prinsessestraat 12, Paramaribo', deliveryNotes: 'Please call on arrival.', customerLat: 5.845, customerLng: -55.194, distanceKm: 3.2,
      bagTotal: 75, adminFee: 30, platformFee: 50, deliveryFee: 100, totalAmount: 280.5, status: 'on_its_way', paymentStatus: 'paid',
      items: { create: [{ productId: 'pain-fever-tablets', productName: 'Pain & Fever Relief Tablets', unitPrice: 28, quantity: 1 }, { productId: 'glucose-tablets', productName: 'Glucose Tablets', unitPrice: 30, quantity: 1 }] },
    },
    update: {},
  })

  await prisma.order.upsert({
    where: { id: 'sample-pickup-order' },
    create: {
      id: 'sample-pickup-order', userId: demoCustomer.id, pharmacyId: 'ph1', customerName: 'Denver', email: demoCustomer.email, phone: '+597 123 4567',
      deliveryMethod: 'pickup', pickupTime: 'Tomorrow after 10:00', bagTotal: 95, adminFee: 30, platformFee: 50, deliveryFee: 0, totalAmount: 192.5, status: 'pending', paymentStatus: 'unpaid',
      items: { create: [{ productId: 'omega-3', productName: 'Omega-3 Fish Oil', unitPrice: 95, quantity: 1 }] },
    },
    update: {},
  })

  await prisma.review.upsert({
    where: { id: 'sample-testimonial' },
    create: { id: 'sample-testimonial', userId: demoCustomer.id, productId: 'account-review', rating: 5, comment: 'Fast delivery, clear updates, and an easy checkout experience.' },
    update: {},
  })

  // Clear existing todos
  await prisma.todo.deleteMany()

  // Create example todos
  const todos = await prisma.todo.createMany({
    data: [
      { title: 'Buy groceries' },
      { title: 'Read a book' },
      { title: 'Workout' },
    ],
  })

  console.log(`✅ Created ${todos.count} todos`)
  console.log(`✅ Synced ${categories.length} product categories`)
  console.log(`✅ Synced ${products.length} HealthEase catalog products`)
  console.log('✅ Added sample orders and testimonial')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
