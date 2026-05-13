const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting sync...');

  // Create requested admin user
  const adminEmail = 'omdjr4life@gmail.com';
  const hashedPassword = await bcrypt.hash('onepiece##12', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: {
      email: adminEmail,
      name: 'Primary Admin',
      role: 'ADMIN',
      accounts: {
        create: {
          id: 'admin-account-id',
          accountId: adminEmail,
          providerId: 'credential',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }
    }
  });

  console.log(`Ensured admin user: ${adminEmail}`);

  const courses = [
    {
      title: 'Solana Fundamentals',
      slug: 'solana-fundamentals',
      description: 'Master the basics of the Solana blockchain and high-performance computing.',
      priceSOL: 0.5,
      level: 'BEGINNER',
      instructor: 'Solana Foundation',
      category: 'Blockchain',
      status: 'PUBLISHED',
      lessons: [
        { title: 'Introduction to Solana', videoUrl: 'https://vimeo.com/836440751', order: 1 },
        { title: 'The Sealevel Runtime', videoUrl: 'https://vimeo.com/836440751', order: 2 },
        { title: 'Solana Accounts Model', videoUrl: 'https://vimeo.com/836440751', order: 3 },
      ]
    },
    {
      title: 'Rust for Smart Contracts',
      slug: 'rust-smart-contracts',
      description: 'Learn the programming language that powers the most secure smart contracts.',
      priceSOL: 1.2,
      level: 'INTERMEDIATE',
      instructor: 'Web3 Academy',
      category: 'Development',
      status: 'PUBLISHED',
      lessons: [
        { title: 'Rust Syntax Basics', videoUrl: 'https://vimeo.com/836440751', order: 1 },
        { title: 'Ownership & Borrowing', videoUrl: 'https://vimeo.com/836440751', order: 2 },
        { title: 'Anchor Framework Intro', videoUrl: 'https://vimeo.com/836440751', order: 3 },
      ]
    },
    {
      title: 'Advanced DeFi Protocols',
      slug: 'advanced-defi',
      description: 'Deep dive into AMMs, Lending protocols, and Yield aggregation.',
      priceSOL: 2.5,
      level: 'ADVANCED',
      instructor: 'DeFi Labs',
      category: 'Finance',
      status: 'PUBLISHED',
      lessons: [
        { title: 'Concentrated Liquidity', videoUrl: 'https://vimeo.com/836440751', order: 1 },
        { title: 'Flash Loans & Liquidations', videoUrl: 'https://vimeo.com/836440751', order: 2 },
        { title: 'Curve & Stablecoin Math', videoUrl: 'https://vimeo.com/836440751', order: 3 },
      ]
    }
  ];

  for (const c of courses) {
    const { lessons, ...courseData } = c;
    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: courseData,
      create: courseData,
    });

    console.log(`Synced course: ${course.title}`);

    for (const l of lessons) {
      const lessonId = `${course.id}-${l.order}`;
      await prisma.lesson.upsert({
        where: { id: lessonId },
        update: { ...l, courseId: course.id },
        create: { ...l, id: lessonId, courseId: course.id },
      });
    }
  }

  console.log('Sync complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
