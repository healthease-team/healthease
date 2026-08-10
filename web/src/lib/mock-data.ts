import type {
  Category,
  Product,
  Pharmacy,
  Review,
  Order,
  Message,
  FaqItem,
} from './types'

export const categories: Category[] = [
  { id: 'personal-care', name: 'Personal care', slug: 'personal-care', image: '/images/personal_care.png' },
  { id: 'diabetic-care', name: 'Diabetic Care', slug: 'diabetic-care', image: '/images/diabetic_care.png' },
  { id: 'supplements', name: 'Supplements', slug: 'supplements', image: '/images/supplements.png' },
  { id: 'devices', name: 'Devices', slug: 'devices', image: '/images/medical_devices.png' },
  { id: 'vitamins', name: 'Vitamins', slug: 'vitamins', image: '/images/products/vitamins1.png' },
  { id: 'first-aid', name: 'First Aid', slug: 'first-aid', image: '/images/first_aid_basics.png' },
  { id: 'allergy', name: 'Allergy', slug: 'allergy', image: '/images/allergy.png' },
  { id: 'immune-support', name: 'Immune Support', slug: 'immune-support', image: '/images/immune_support.png' },
  { id: 'pain-fever', name: 'Pain & Fever Relief', slug: 'pain-fever', image: '/images/pain_and_fever_relief.png' },
]

export const essentialsCategories = [
  { tag: 'morning', name: 'Morning Essentials', image: '/images/morning_essentials.png' },
  { tag: 'on-the-go', name: 'On the Go', image: '/images/on_the_go.png' },
  { tag: 'night', name: 'Night Care', image: '/images/night_care.png' },
  { tag: 'travel', name: 'Travel Kit', image: '/images/travel.png' },
  { tag: 'office', name: 'Office Care', image: '/images/office.png' },
  { tag: 'sports', name: 'Sports', image: '/images/sports.png' },
] as const

export const products: Product[] = [
  { id: 'p1', name: 'Alcohol Swabs', description: 'Individually wrapped antiseptic swabs for quick clean-ups.', price: 15, categoryId: 'first-aid', subCategory: 'travel', imageUrl: '/images/products/alcohol-swabs.png',
    ingredients: ['70% Isopropyl alcohol', 'Purified water'], dosage: 'Single-use swab per application; discard after one use.', usage: 'Tear open the pouch, wipe the skin or surface, and allow to air dry before injection or dressing.', conditions: ['Skin disinfection', 'Wound cleaning', 'Pre-injection prep'] },
  { id: 'p2', name: 'Allergy Relief Tablets', description: 'Fast-acting antihistamine for seasonal allergies.', price: 45, categoryId: 'allergy', subCategory: 'on-the-go', imageUrl: '/images/products/allergy1.png',
    ingredients: ['Cetirizine HCl 10mg'], dosage: 'Adults and children 12+: 1 tablet (10mg) once daily. Do not exceed 1 tablet in 24 hours.', usage: 'Swallow whole with a glass of water, with or without food.', conditions: ['Seasonal allergies', 'Hay fever', 'Hives', 'Itchy or watery eyes'] },
  { id: 'p3', name: 'Aloe Vera Gel', description: 'Soothing gel for skin hydration and after-sun care.', price: 35, categoryId: 'personal-care', subCategory: 'night', imageUrl: '/images/products/aloevera.png',
    ingredients: ['Aloe barbadensis leaf extract 95%', 'Glycerin', 'Vitamin E'], dosage: 'Apply a thin layer to the affected area up to 3 times daily.', usage: 'Massage gently into clean, dry skin until fully absorbed.', conditions: ['Sunburn', 'Dry skin', 'Minor skin irritation'] },
  { id: 'p4', name: 'Adhesive Bandages', description: 'Flexible fabric bandages, assorted sizes.', price: 20, categoryId: 'first-aid', subCategory: 'travel', imageUrl: '/images/products/bandages.png',
    ingredients: ['Non-woven fabric', 'Hypoallergenic adhesive', 'Absorbent pad'], dosage: 'Use one bandage per wound; replace daily or when wet or dirty.', usage: 'Clean the wound, apply a bandage over it, and press the edges down to secure.', conditions: ['Minor cuts', 'Scrapes', 'Blisters'] },
  { id: 'p5', name: 'Hydrating Body Lotion', description: 'Fragrance-free lotion for dry skin, nightly use.', price: 60, categoryId: 'personal-care', subCategory: 'night', imageUrl: '/images/products/bodylotion.png',
    ingredients: ['Shea butter', 'Glycerin', 'Ceramides'], dosage: 'Apply liberally to skin once or twice daily, especially before bed.', usage: 'Smooth onto clean, dry skin and massage until absorbed.', conditions: ['Dry skin', 'Rough or flaky patches'] },
  { id: 'p6', name: 'Deodorant Stick', description: '24-hour protection, gentle on skin.', price: 25, categoryId: 'personal-care', subCategory: 'morning', imageUrl: '/images/products/deo.png',
    ingredients: ['Aluminum-free odor protection complex', 'Aloe vera', 'Fragrance'], dosage: 'Apply once in the morning to clean, dry underarms.', usage: 'Twist up the stick and glide 3-4 strokes on each underarm.', conditions: ['Body odor', 'Daily hygiene'] },
  { id: 'p7', name: 'Digital Thermometer', description: 'Fast, accurate readings with fever alert.', price: 120, categoryId: 'devices', subCategory: 'office', imageUrl: '/images/products/device1.png',
    ingredients: [], dosage: 'Not applicable — this is a measuring device, not a medication.', usage: 'Place under the tongue, in the armpit, or rectally per the package guidance, then wait for the beep and read the display.', conditions: ['Fever monitoring', 'General temperature checks'] },
  { id: 'p8', name: 'Blood Pressure Monitor', description: 'Automatic upper-arm monitor with memory storage.', price: 350, categoryId: 'devices', subCategory: 'office', imageUrl: '/images/products/device2.png',
    ingredients: [], dosage: 'Not applicable — this is a measuring device, not a medication.', usage: 'Sit calmly for 5 minutes, wrap the cuff around your upper arm at heart level, and press start.', conditions: ['Blood pressure monitoring', 'Hypertension management'] },
  { id: 'p9', name: 'Pulse Oximeter', description: 'Fingertip SpO2 and heart rate monitor.', price: 180, categoryId: 'devices', subCategory: 'sports', imageUrl: '/images/products/device3.png',
    ingredients: [], dosage: 'Not applicable — this is a measuring device, not a medication.', usage: 'Clip onto a fingertip and hold still for 10-15 seconds until the reading stabilizes.', conditions: ['Oxygen saturation monitoring', 'Heart rate checks'] },
  { id: 'p10', name: 'Gentle Face Wash', description: 'Daily cleanser for sensitive skin.', price: 55, categoryId: 'personal-care', subCategory: 'morning', imageUrl: '/images/products/face_wash.png',
    ingredients: ['Glycerin', 'Chamomile extract', 'Mild surfactants (sulfate-free)'], dosage: 'Use morning and night.', usage: 'Wet face, massage a small amount in circular motions, then rinse with lukewarm water.', conditions: ['Sensitive skin', 'Daily facial cleansing'] },
  { id: 'p11', name: 'Glucose Tablets', description: 'Fast-acting glucose for low blood sugar relief.', price: 30, categoryId: 'diabetic-care', subCategory: 'on-the-go', imageUrl: '/images/products/glucose_tablets.png',
    ingredients: ['Dextrose 4g per tablet'], dosage: 'Chew 3-4 tablets at the first sign of low blood sugar; recheck glucose after 15 minutes.', usage: 'Chew thoroughly; follow with a small snack if symptoms persist.', conditions: ['Hypoglycemia (low blood sugar)'] },
  { id: 'p12', name: 'Lancets (Pack of 100)', description: 'Fine-gauge lancets for blood glucose testing.', price: 40, categoryId: 'diabetic-care', subCategory: 'office', imageUrl: '/images/products/lancets.png',
    ingredients: ['Sterile stainless steel needle'], dosage: 'Single-use lancet per test; discard after each use.', usage: 'Insert into a lancing device, prick the fingertip, and dispose of in a sharps container.', conditions: ['Blood glucose testing'] },
  { id: 'p13', name: 'Daily Shampoo', description: 'Sulfate-free shampoo for everyday use.', price: 65, categoryId: 'personal-care', subCategory: 'morning', imageUrl: '/images/products/shampoo.png',
    ingredients: ['Sulfate-free cleansing base', 'Panthenol', 'Argan oil'], dosage: 'Use every day or every other day.', usage: 'Wet hair, massage into scalp, lather, and rinse thoroughly.', conditions: ['Everyday hair and scalp care'] },
  { id: 'p14', name: 'Multivitamin Complex', description: 'Daily multivitamin with essential minerals.', price: 85, categoryId: 'supplements', imageUrl: '/images/products/sup2.png',
    ingredients: ['Vitamins A, C, D, E, B-complex', 'Zinc', 'Iron', 'Magnesium'], dosage: 'Adults: 1 tablet daily with a meal.', usage: 'Swallow with water; do not chew.', conditions: ['General wellness support', 'Nutritional gaps', 'Low energy'] },
  { id: 'p15', name: 'Omega-3 Fish Oil', description: 'Supports heart and brain health.', price: 95, categoryId: 'supplements', subCategory: 'night', imageUrl: '/images/products/sup3.png',
    ingredients: ['Fish oil concentrate (EPA/DHA 1000mg)', 'Vitamin E (preservative)'], dosage: 'Adults: 1-2 softgels daily with food.', usage: 'Swallow whole with a meal to reduce fishy aftertaste.', conditions: ['Heart health support', 'Brain and joint health'] },
  { id: 'p16', name: 'Probiotic Capsules', description: 'Daily probiotic blend for digestive health.', price: 90, categoryId: 'supplements', subCategory: 'sports', imageUrl: '/images/products/sup4.png',
    ingredients: ['Multi-strain probiotic blend (10 billion CFU)', 'Prebiotic fiber'], dosage: 'Adults: 1 capsule daily, preferably in the morning on an empty stomach.', usage: 'Swallow with a glass of cool water; avoid taking with hot drinks.', conditions: ['Digestive health', 'Gut flora balance', 'Bloating'] },
  { id: 'p17', name: 'Vitamin C Chewables', description: 'Immune support in a tasty chewable tablet.', price: 50, categoryId: 'immune-support', subCategory: 'on-the-go', imageUrl: '/images/products/supplements1.png',
    ingredients: ['Vitamin C (ascorbic acid) 500mg', 'Natural citrus flavor'], dosage: 'Adults and children 4+: 1 tablet daily.', usage: 'Chew thoroughly before swallowing; can be taken with or without food.', conditions: ['Immune support', 'Cold season prevention'] },
  { id: 'p18', name: 'Glucose Test Strips', description: 'Compatible test strips for daily monitoring.', price: 110, categoryId: 'diabetic-care', imageUrl: '/images/products/teststrips.png',
    ingredients: ['Enzymatic glucose oxidase strip'], dosage: 'Single-use strip per test.', usage: 'Insert into a compatible glucose meter and apply a small blood sample to the strip edge.', conditions: ['Blood glucose monitoring'] },
  { id: 'p19', name: 'Daily Multivitamins', description: 'Complete daily vitamin and mineral blend.', price: 75, categoryId: 'vitamins', subCategory: 'sports', imageUrl: '/images/products/vitamins1.png',
    ingredients: ['Vitamins A, C, D3, E, B-complex', 'Calcium', 'Zinc'], dosage: 'Adults: 1 tablet daily with breakfast.', usage: 'Swallow with water.', conditions: ['General wellness support', 'Active lifestyles'] },
  { id: 'p20', name: 'Antibacterial Wipes', description: 'Travel-size wipes for on-the-go hygiene.', price: 18, categoryId: 'first-aid', subCategory: 'travel', imageUrl: '/images/products/wipes1.png',
    ingredients: ['Benzalkonium chloride 0.1%', 'Purified water'], dosage: 'Use one wipe per application; discard after use.', usage: 'Wipe hands or surfaces thoroughly and allow to air dry.', conditions: ['On-the-go hand hygiene', 'Surface disinfection'] },
  { id: 'p21', name: 'Pain & Fever Relief Tablets', description: 'Fast relief from pain and fever symptoms.', price: 28, categoryId: 'pain-fever', imageUrl: '/images/pain_and_fever_relief.png',
    ingredients: ['Paracetamol (Acetaminophen) 500mg'], dosage: 'Adults: 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.', usage: 'Swallow with water; take with food if it upsets your stomach.', conditions: ['Headache', 'Fever', 'Muscle aches', 'Minor pain relief'] },
]

export const mustHaveProductIds = ['p21', 'p2', 'p17', 'p1']

export const pharmacies: Pharmacy[] = [
  { id: 'ph1', ownerId: 'owner-1', name: 'Central Pharmacy', address: 'Waterkant 1, Paramaribo', lat: 5.852, lng: -55.2038 },
  { id: 'ph2', ownerId: 'owner-2', name: 'Wanica Health', address: 'Hoofdstraat 5, Lelydorp', lat: 5.7, lng: -55.2333 },
  { id: 'ph3', ownerId: 'owner-3', name: 'Nickerie Pharmacy', address: 'Waterloostraat 15, Nieuw Nickerie', lat: 5.95, lng: -56.9667 },
]

export const reviews: Review[] = [
  { id: 'r1', authorName: 'Amara S.', comment: "HealthEase saved me a trip across town — ordered my prescription and it was delivered same day.", rating: 5, createdAt: '2026-06-02' },
  { id: 'r2', authorName: 'Dinesh R.', comment: 'Great selection of everyday essentials, prices are fair and checkout is quick.', rating: 4, createdAt: '2026-06-10' },
  { id: 'r3', authorName: 'Fatima J.', comment: 'The pickup option is perfect for when I\'m already out running errands.', rating: 5, createdAt: '2026-06-15' },
  { id: 'r4', authorName: 'Marlon B.', comment: 'Customer support helped me sort a delivery issue within minutes.', rating: 4, createdAt: '2026-06-20' },
  { id: 'r5', authorName: 'Priya K.', comment: 'Love that I can compare stock across pharmacies before ordering.', rating: 5, createdAt: '2026-06-25' },
  { id: 'r6', authorName: 'Sherwin T.', comment: 'Delivery fee is reasonable and clearly shown before checkout.', rating: 4, createdAt: '2026-07-01' },
  { id: 'r7', authorName: 'Naomi V.', comment: 'Simple, trustworthy, and my go-to for monthly essentials now.', rating: 5, createdAt: '2026-07-05' },
  { id: 'r8', authorName: 'Ricardo P.', comment: 'Wish there were more payment options, but overall a smooth experience.', rating: 4, createdAt: '2026-07-08' },
]

export const orders: Order[] = [
  {
    id: 'o1', customerId: 'demo-customer', pharmacyId: 'ph1',
    customerName: 'Shakeel R.', email: 'shakeelramdhiansing@gmail.com', phone: '+597 123 4567',
    deliveryMethod: 'delivery', deliveryAddress: 'Prinsessestraat 12, Paramaribo',
    customerLat: 5.845, customerLng: -55.1938, distanceKm: 3.2,
    bagTotal: 130, adminFee: 30, platformFee: 50, deliveryFee: 100, totalAmount: 310,
    status: 'on_its_way', paymentStatus: 'paid', createdAt: '2026-07-09',
    items: [
      { id: 'oi1', orderId: 'o1', productId: 'p21', productName: 'Pain & Fever Relief Tablets', unitPrice: 28, quantity: 2 },
      { id: 'oi2', orderId: 'o1', productId: 'p11', productName: 'Glucose Tablets', unitPrice: 30, quantity: 1 },
      { id: 'oi3', orderId: 'o1', productId: 'p14', productName: 'Multivitamin Complex', unitPrice: 85, quantity: 1 },
    ],
  },
  {
    id: 'o2', customerId: 'demo-customer', pharmacyId: 'ph2',
    customerName: 'Shakeel R.', email: 'shakeelramdhiansing@gmail.com', phone: '+597 123 4567',
    deliveryMethod: 'pickup', pickupTime: '2026-07-05 14:00',
    bagTotal: 65, adminFee: 30, platformFee: 50, deliveryFee: 0, totalAmount: 145,
    status: 'delivered', paymentStatus: 'paid', createdAt: '2026-07-03',
    items: [
      { id: 'oi4', orderId: 'o2', productId: 'p13', productName: 'Daily Shampoo', unitPrice: 65, quantity: 1 },
    ],
  },
  {
    id: 'o3', customerId: 'demo-customer', pharmacyId: 'ph1',
    customerName: 'Shakeel R.', email: 'shakeelramdhiansing@gmail.com', phone: '+597 123 4567',
    deliveryMethod: 'delivery', deliveryAddress: 'Kwattaweg 50, Paramaribo',
    customerLat: 5.83, customerLng: -55.21, distanceKm: 5.6,
    bagTotal: 240, adminFee: 30, platformFee: 50, deliveryFee: 100, totalAmount: 420,
    status: 'pending', paymentStatus: 'unpaid', createdAt: '2026-07-11',
    items: [
      { id: 'oi5', orderId: 'o3', productId: 'p8', productName: 'Blood Pressure Monitor', unitPrice: 350, quantity: 1 },
    ],
  },
  {
    id: 'o4', customerId: 'other-customer', pharmacyId: 'ph1',
    customerName: 'Anjali M.', email: 'anjali.m@example.com', phone: '+597 234 5678',
    deliveryMethod: 'delivery', deliveryAddress: 'Zwartenhovenbrugstraat 3, Paramaribo',
    customerLat: 5.82, customerLng: -55.16, distanceKm: 7.1,
    bagTotal: 180, adminFee: 30, platformFee: 50, deliveryFee: 100, totalAmount: 360,
    status: 'accepted', paymentStatus: 'paid', createdAt: '2026-07-10',
    items: [
      { id: 'oi6', orderId: 'o4', productId: 'p9', productName: 'Pulse Oximeter', unitPrice: 180, quantity: 1 },
    ],
  },
  {
    id: 'o5', customerId: 'other-customer-2', pharmacyId: 'ph1',
    customerName: 'Björn K.', email: 'bjorn.k@example.com', phone: '+597 345 6789',
    deliveryMethod: 'pickup', pickupTime: '2026-07-12 10:30',
    bagTotal: 95, adminFee: 30, platformFee: 50, deliveryFee: 0, totalAmount: 175,
    status: 'ready_for_pickup', paymentStatus: 'paid', createdAt: '2026-07-10',
    items: [
      { id: 'oi7', orderId: 'o5', productId: 'p15', productName: 'Omega-3 Fish Oil', unitPrice: 95, quantity: 1 },
    ],
  },
  {
    id: 'o6', customerId: 'other-customer-3', pharmacyId: 'ph1',
    customerName: 'Ingrid P.', email: 'ingrid.p@example.com', phone: '+597 456 7890',
    deliveryMethod: 'delivery', deliveryAddress: 'Verlengde Gemenelandsweg 20, Paramaribo',
    customerLat: 5.86, customerLng: -55.2, distanceKm: 1.8,
    bagTotal: 40, adminFee: 30, platformFee: 50, deliveryFee: 100, totalAmount: 220,
    status: 'cancelled', paymentStatus: 'unpaid', createdAt: '2026-07-08',
    items: [
      { id: 'oi8', orderId: 'o6', productId: 'p12', productName: 'Lancets (Pack of 100)', unitPrice: 40, quantity: 1 },
    ],
  },
]

export const messages: Message[] = [
  { id: 'msg1', name: 'Carla D.', email: 'carla.d@example.com', location: 'Paramaribo', type: 'consulting', message: 'Do you offer bulk pricing for elderly care homes?', createdAt: '2026-07-06' },
  { id: 'msg2', name: 'Roberto S.', email: 'roberto.s@example.com', location: 'Lelydorp', type: 'sponsoring', message: "We'd like to discuss sponsoring your community health drive.", createdAt: '2026-07-07' },
  { id: 'msg3', name: 'Els V.', email: 'els.v@example.com', location: 'Nieuw Nickerie', type: 'consulting', message: 'Can I request a product that is not yet listed on the site?', createdAt: '2026-07-09', readAt: '2026-07-09' },
  { id: 'msg4', name: 'Miguel A.', email: 'miguel.a@example.com', location: 'Paramaribo', type: 'consulting', message: 'What are your delivery hours on weekends?', createdAt: '2026-07-10' },
]

export const faqItems: FaqItem[] = [
  { question: 'How do I check if a product is in stock nearby?', answer: 'Browse the Shop page and each product shows live stock across participating pharmacies — pick the one closest to you before adding to cart.' },
  { question: 'Can I order medication directly through the app?', answer: 'Yes, add items to your cart and check out. Prescription-only items require a photo of your prescription and ID during checkout.' },
  { question: 'How do I find the nearest pharmacy?', answer: 'Use the Locations button in the navbar or hero section to see all partner pharmacies and their addresses.' },
  { question: 'Do I need a prescription for every order?', answer: 'Only for prescription-controlled items. Everyday essentials like vitamins and personal care products do not require one.' },
  { question: 'How does a pharmacy get certified to join HealthEase?', answer: 'Register your pharmacy through the Register flow — our team reviews and approves new pharmacy accounts before they go live.' },
]
