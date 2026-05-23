"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  })

  redirect("/login")
}

export async function redirectToDashboardAction() {
  redirect("/dashboard")
}