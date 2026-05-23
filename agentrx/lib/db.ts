import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "@/lib/generated/prisma/client"
import { env } from "@/env"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const adapter = new PrismaNeon({
  connectionString: env.DATABASE_URL,
})

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  })

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db
}