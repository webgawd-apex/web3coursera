import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClientOptions = process.env.DATABASE_URL 
  ? {} 
  : { datasources: { db: { url: 'postgresql://postgres:postgres@localhost:5432/postgres' } } };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(prismaClientOptions as any)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
