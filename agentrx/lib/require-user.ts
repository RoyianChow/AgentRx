import "server-only"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

export type AuthUser = {
  id: string
  name?: string | null
  email: string
  image?: string | null
  role?: string | null
}

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return session?.user as AuthUser | null
}

export async function requireUser() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

export async function requireAdmin() {
  const user = await requireUser()

  if (user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return user
}