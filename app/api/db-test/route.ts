import { db } from "@/lib/db"

export async function GET() {
  const userCount = await db.user.count()

  return Response.json({
    connected: true,
    userCount,
  })
}