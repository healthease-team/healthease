const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('Start seeding full dataset...');

  // Make seed idempotent (safe to re-run)
  await prisma.stock.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.product.deleteMany();

  // Define categories 
  const categories = [
    // Homepage categories (must match shop + index links)
    'Personal care',
    'Diabetic Care',
    'Supplements',
    'Devices',
    // Extra categories (still supported)
    'Vitamins',
    'First Aid',
    'Allergy',
    'Immune Support',
    'Pain & Fever Relief'
  ];

  const categoryImage = {
    'Personal care': 'images/personal_care.png',
    'Diabetic Care': 'images/diabetic_care.png',
    Supplements: 'images/supplements.png',
    Devices: 'images/medical_devices.png',
    Vitamins: 'images/immune_support.png',
    'First Aid': 'images/first_aid_basics.png',
    Allergy: 'images/allergy.png',
    'Immune Support': 'images/immune_support.png',
    'Pain & Fever Relief': 'images/pain_and_fever_relief.png'
  };

  const productSets = {
    'Personal care': [
      { name: 'Hydrating Body Lotion (250ml)', price: 85.0, imageUrl: 'images/products/bodylotion.png', subCategory: 'Morning Essentials' },
      { name: 'Aloe Vera Hand Cream (75ml)', price: 45.0, imageUrl: 'images/products/aloevera.png', subCategory: 'On-the-go' },
      { name: 'Gentle Shampoo (300ml)', price: 70.0, imageUrl: 'images/products/shampoo.png', subCategory: 'Night Care' },
      { name: 'Moisturizing Face Wash', price: 60.0, imageUrl: 'images/products/face_wash.png', subCategory: 'Travel Kit' },
      { name: 'Deodorant Roll-on', price: 35.0, imageUrl: 'images/products/deo.png', subCategory: 'Office Care' }
    ],
    'Diabetic Care': [
      { name: 'Glucose Test Strips (50ct)', price: 180.0, imageUrl: 'images/products/teststrips.png', subCategory: 'Office Care' },
      { name: 'Lancets (100ct)', price: 55.0, imageUrl: 'images/products/lancets.png', subCategory: 'On-the-go' },
      { name: 'Alcohol Swabs (100ct)', price: 40.0, imageUrl: 'images/products/alcohol-swabs.png', subCategory: 'Travel Kit' },
      { name: 'Sugar-Free Glucose Tablets', price: 65.0, imageUrl: 'images/products/glucose_tablets.png', subCategory: 'On-the-go' }
    ],
    Supplements: [
      { name: 'Vitamin C 1000mg (30 tablets)', price: 95.0, imageUrl: 'images/products/supplements1.png', subCategory: 'Morning Essentials' },
      { name: 'Multivitamin Daily (60 tablets)', price: 140.0, imageUrl: 'images/products/sup2.png', subCategory: 'Morning Essentials' },
      { name: 'Omega-3 Fish Oil (60 softgels)', price: 160.0, imageUrl: 'images/products/sup3.png', subCategory: 'Sports' },
      { name: 'Magnesium (30 tablets)', price: 80.0, imageUrl: 'images/products/sup4.png', subCategory: 'Night Care' }
    ],
    Devices: [
      { name: 'Digital Thermometer', price: 120.0, imageUrl: 'images/products/device1.png', subCategory: 'Office Care' },
      { name: 'Blood Pressure Monitor', price: 450.0, imageUrl: 'images/products/device2.png', subCategory: 'Office Care' },
      { name: 'First Aid Kit (Travel)', price: 220.0, imageUrl: 'images/products/device3.png', subCategory: 'Travel Kit' }
    ],
    Vitamins: [
      { name: 'Vitamin D3 2000IU (60 tablets)', price: 110.0, imageUrl: 'images/products/vitamin1.png', subCategory: 'Morning Essentials' }
    ],
    'First Aid': [
      { name: 'Elastic Bandage', price: 55.0, imageUrl: 'images/products/bandages.png', subCategory: 'Travel Kit' },
      { name: 'Antiseptic Wipes (20ct)', price: 35.0, imageUrl: 'images/products/wipes1.png', subCategory: 'On-the-go' }
    ],
    Allergy: [
      { name: 'Allergy Relief Tablets', price: 90.0, imageUrl: categoryImage['Allergy'], subCategory: 'Morning Essentials' }
    ],
    'Immune Support': [
      { name: 'Immune Support Gummies', price: 120.0, imageUrl: categoryImage['Immune Support'], subCategory: 'Morning Essentials' }
    ],
    'Pain & Fever Relief': [
      { name: 'Paracetamol 500mg (20 tablets)', price: 40.0, imageUrl: 'images/products/thermometer.svg', subCategory: 'On-the-go' },
      { name: 'Ibuprofen 200mg (20 tablets)', price: 55.0, imageUrl: 'images/products/thermometer.svg', subCategory: 'On-the-go' }
    ]
  };

  for (const cat of categories) {
    const base = productSets[cat] || [];
    // Add a few generic fillers so every category has enough items for UI testing
    const fillers = Array.from({ length: 6 }, (_, idx) => {
      const n = idx + 1;
      return {
        name: `${cat} Essentials ${n}`,
        price: randInt(40, 240) + (Math.random() < 0.5 ? 0.0 : 0.5),
        imageUrl: categoryImage[cat] || 'images/shop_all_cat.png',
        subCategory: ['Morning Essentials', 'On-the-go', 'Night Care', 'Travel Kit', 'Office Care', 'Sports'][n % 6]
      };
    });

    const items = [...base, ...fillers];
    for (const item of items) {
      await prisma.product.create({
        data: {
          name: item.name,
          description: `Productomschrijving voor ${item.name}.`,
          price: item.price,
          category: cat,
          subCategory: item.subCategory,
          imageUrl: item.imageUrl
        }
      });
    }
  }

  // Create pharmacies in Paramaribo, Wanica, Nickerie
  const pharmaciesData = [
    {
      name: 'Central Pharmacy',
      address: 'Waterkant 1, Paramaribo',
      lat: 5.825,
      lng: -55.167,
      email: 'central@healtease.test',
      password: 'pharmacy123'
    },
    {
      name: 'Wanica Health',
      address: 'Hoofdstraat 5, Lelydorp',
      lat: 5.713,
      lng: -55.204,
      email: 'wanica@healtease.test',
      password: 'pharmacy123'
    },
    {
      name: 'Nickerie Pharmacy',
      address: 'Keizerstraat 12, Nieuw Nickerie',
      lat: 5.966,
      lng: -57.040,
      email: 'nickerie@healtease.test',
      password: 'pharmacy123'
    }
  ];

  const createdPharmacies = [];
  for (const p of pharmaciesData) {
    const created = await prisma.pharmacy.upsert({
      where: { email: p.email },
      update: {},
      create: p
    });
    createdPharmacies.push(created);
  }

  // Create stocks: each pharmacy gets inventory for each product
  const allProducts = await prisma.product.findMany();
  for (const product of allProducts) {
    for (const ph of createdPharmacies) {
      const qty = randInt(10, 60);
      await prisma.stock.create({
        data: {
          pharmacyId: ph.id,
          productId: product.id,
          quantity: qty
        }
      });
    }
  }

  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const pharmacyPasswordHash = await bcrypt.hash('pharmacy123', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);

  // Admin + pharmacy users
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: [
      {
        email: 'admin@healtease.test',
        password: adminPasswordHash,
        name: 'HealthEase Admin',
        role: 'ADMIN'
      },
      {
        email: 'central@healtease.test',
        password: pharmacyPasswordHash,
        name: 'Central Pharmacy User',
        role: 'PHARMACY'
      },
      {
        email: 'user@healtease.test',
        password: userPasswordHash,
        name: 'Test User',
        role: 'CUSTOMER'
      }
    ]
  });
  
  // A few sample reviews
  await prisma.review.createMany({
    data: [
      { author: 'Sophie V.', comment: 'Super snelle levering van mijn medicijnen!', rating: 5 },
      { author: 'Linda G.', comment: 'Eindelijk een overzichtelijke apotheek app in Suriname.', rating: 4 }
    ]
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });