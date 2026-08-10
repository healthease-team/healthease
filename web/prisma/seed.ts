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
    { id: 'alcohol-swabs', name: 'Alcohol Swabs', description: 'Individually wrapped antiseptic swabs for quick clean-ups.', price: 15, categoryId: 'first-aid', imageUrl: '/images/products/alcohol-swabs.png', quantity: 80,
      ingredients: ['70% Isopropyl alcohol', 'Purified water'], dosage: 'Single-use swab per application; discard after one use.', usage: 'Tear open the pouch, wipe the skin or surface, and allow to air dry before injection or dressing.', conditions: ['Skin disinfection', 'Wound cleaning', 'Pre-injection prep'] },
    { id: 'allergy-relief', name: 'Allergy Relief Tablets', description: 'Fast-acting antihistamine for seasonal allergies.', price: 45, categoryId: 'allergy', imageUrl: '/images/products/allergy1.png', quantity: 42,
      ingredients: ['Cetirizine HCl 10mg'], dosage: 'Adults and children 12+: 1 tablet (10mg) once daily. Do not exceed 1 tablet in 24 hours.', usage: 'Swallow whole with a glass of water, with or without food.', conditions: ['Seasonal allergies', 'Hay fever', 'Hives', 'Itchy or watery eyes'] },
    { id: 'aloe-vera-gel', name: 'Aloe Vera Gel', description: 'Soothing gel for skin hydration and after-sun care.', price: 35, categoryId: 'personal-care', imageUrl: '/images/products/aloevera.png', quantity: 35,
      ingredients: ['Aloe barbadensis leaf extract 95%', 'Glycerin', 'Vitamin E'], dosage: 'Apply a thin layer to the affected area up to 3 times daily.', usage: 'Massage gently into clean, dry skin until fully absorbed.', conditions: ['Sunburn', 'Dry skin', 'Minor skin irritation'] },
    { id: 'adhesive-bandages', name: 'Adhesive Bandages', description: 'Flexible fabric bandages in assorted sizes.', price: 20, categoryId: 'first-aid', imageUrl: '/images/products/bandages.png', quantity: 120,
      ingredients: ['Non-woven fabric', 'Hypoallergenic adhesive', 'Absorbent pad'], dosage: 'Use one bandage per wound; replace daily or when wet or dirty.', usage: 'Clean the wound, apply a bandage over it, and press the edges down to secure.', conditions: ['Minor cuts', 'Scrapes', 'Blisters'] },
    { id: 'digital-thermometer', name: 'Digital Thermometer', description: 'Fast and accurate temperature readings with fever alert.', price: 120, categoryId: 'devices', imageUrl: '/images/products/device1.png', quantity: 18,
      ingredients: [], dosage: 'Not applicable — this is a measuring device, not a medication.', usage: 'Place under the tongue, in the armpit, or rectally per the package guidance, then wait for the beep and read the display.', conditions: ['Fever monitoring', 'General temperature checks'] },
    { id: 'blood-pressure-monitor', name: 'Blood Pressure Monitor', description: 'Automatic upper-arm monitor with memory storage.', price: 350, categoryId: 'devices', imageUrl: '/images/products/device2.png', quantity: 12,
      ingredients: [], dosage: 'Not applicable — this is a measuring device, not a medication.', usage: 'Sit calmly for 5 minutes, wrap the cuff around your upper arm at heart level, and press start.', conditions: ['Blood pressure monitoring', 'Hypertension management'] },
    { id: 'glucose-tablets', name: 'Glucose Tablets', description: 'Fast-acting glucose for low blood sugar relief.', price: 30, categoryId: 'diabetic-care', imageUrl: '/images/products/glucose_tablets.png', quantity: 50,
      ingredients: ['Dextrose 4g per tablet'], dosage: 'Chew 3-4 tablets at the first sign of low blood sugar; recheck glucose after 15 minutes.', usage: 'Chew thoroughly; follow with a small snack if symptoms persist.', conditions: ['Hypoglycemia (low blood sugar)'] },
    { id: 'glucose-test-strips', name: 'Glucose Test Strips', description: 'Compatible test strips for daily monitoring.', price: 110, categoryId: 'diabetic-care', imageUrl: '/images/products/teststrips.png', quantity: 28,
      ingredients: ['Enzymatic glucose oxidase strip'], dosage: 'Single-use strip per test.', usage: 'Insert into a compatible glucose meter and apply a small blood sample to the strip edge.', conditions: ['Blood glucose monitoring'] },
    { id: 'multivitamin-complex', name: 'Multivitamin Complex', description: 'Daily multivitamin with essential minerals.', price: 85, categoryId: 'supplements', imageUrl: '/images/products/sup2.png', quantity: 44,
      ingredients: ['Vitamins A, C, D, E, B-complex', 'Zinc', 'Iron', 'Magnesium'], dosage: 'Adults: 1 tablet daily with a meal.', usage: 'Swallow with water; do not chew.', conditions: ['General wellness support', 'Nutritional gaps', 'Low energy'] },
    { id: 'omega-3', name: 'Omega-3 Fish Oil', description: 'Supports heart and brain health.', price: 95, categoryId: 'supplements', imageUrl: '/images/products/sup3.png', quantity: 32,
      ingredients: ['Fish oil concentrate (EPA/DHA 1000mg)', 'Vitamin E (preservative)'], dosage: 'Adults: 1-2 softgels daily with food.', usage: 'Swallow whole with a meal to reduce fishy aftertaste.', conditions: ['Heart health support', 'Brain and joint health'] },
    { id: 'vitamin-c', name: 'Vitamin C Chewables', description: 'Immune support in a tasty chewable tablet.', price: 50, categoryId: 'immune-support', imageUrl: '/images/products/supplements1.png', quantity: 60,
      ingredients: ['Vitamin C (ascorbic acid) 500mg', 'Natural citrus flavor'], dosage: 'Adults and children 4+: 1 tablet daily.', usage: 'Chew thoroughly before swallowing; can be taken with or without food.', conditions: ['Immune support', 'Cold season prevention'] },
    { id: 'pain-fever-tablets', name: 'Pain & Fever Relief Tablets', description: 'Fast relief from common pain and fever symptoms.', price: 28, categoryId: 'pain-fever', imageUrl: '/images/pain_and_fever_relief.png', quantity: 75,
      ingredients: ['Paracetamol (Acetaminophen) 500mg'], dosage: 'Adults: 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.', usage: 'Swallow with water; take with food if it upsets your stomach.', conditions: ['Headache', 'Fever', 'Muscle aches', 'Minor pain relief'] },
  ] as const

  await Promise.all(products.map(async ({ id, name, description, price, categoryId, imageUrl, quantity, ingredients, dosage, usage, conditions }) => {
    await prisma.product.upsert({
      where: { id },
      create: { id, name, description, price, categoryId, imageUrl, pharmacyId: 'ph1', ingredients: [...ingredients], dosage, usage, conditions: [...conditions], stock: { create: { pharmacyId: 'ph1', quantity } } },
      update: { name, description, price, categoryId, imageUrl, ingredients: [...ingredients], dosage, usage, conditions: [...conditions], stock: { upsert: { create: { pharmacyId: 'ph1', quantity }, update: { quantity } } } },
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
