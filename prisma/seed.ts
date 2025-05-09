import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Add any initial data you want to seed here
  // For example, you could create a test user:
  /*
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
    },
  });
  console.log('Created test user:', testUser);
  */

  console.log('Database seeding completed');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });