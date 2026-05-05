import 'dotenv/config';
import { db } from '../lib/db';
import { users, categories } from '../drizzle/schema';
import { hashPassword } from '../lib/auth';

async function seed() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await hashPassword('admin123'); // Change this in production!
  await db.insert(users).values({
    email: 'admin@shaaciye.so',
    password: adminPassword,
    role: 'admin',
  }).onConflictDoNothing();
  console.log('Admin user created (email: admin@shaaciye.so, password: admin123)');

  // Create categories
  const categoryData = [
    { name: 'Vegetables', image: '/images/vegtables.png' },
    { name: 'Fruits', image: '/images/fruits.png' },
    { name: 'Sweets', image: '/images/sweets.png' },
    { name: 'Drinks', image: '/images/drinks.png' },
    { name: 'Fresh Meat', image: '/images/meat.png' },
    { name: 'Home Care', image: '/images/homecare.png' },
    { name: 'Baby Care', image: '/images/babycare.png' },
  ];

  for (const category of categoryData) {
    await db.insert(categories).values(category).onConflictDoNothing();
  }
  console.log('Categories created');

  console.log('Seeding completed!');
}

seed().catch(console.error);
