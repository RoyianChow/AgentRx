"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { ROUTES } from "@/constants/routes"

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  })

  redirect(ROUTES.AUTH.LOGIN)
}

export async function redirectToDashboardAction() {
  redirect(ROUTES.DASHBOARD.ROOT)
}