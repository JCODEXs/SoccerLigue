import { PrismaClient } from '@prisma/client'

// Simple global instance pattern
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient
}

// Create or reuse the Prisma instance
export const db = globalForPrisma.prisma || new PrismaClient()

// In development, attach to global to prevent hot-reload issues
if (process.env.NODE_ENV === 'development') {
  globalForPrisma.prisma = db
}