"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Loader2, LogOut, Search } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { getInitials } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/constants/routes"

type DashboardHeaderProps = {
  user: {
    name?: string | null
    email: string
    role?: string | null
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    if (isSigningOut) return

    setIsSigningOut(true)

    try {
      await authClient.signOut()
      router.replace(ROUTES.AUTH.LOGIN)
      router.refresh()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
            Pharmacy Dashboard
          </h1>
          <p className="hidden text-sm text-slate-500 sm:block">
            Monitor patients, prescriptions, AI checks, and safety flags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search patients or prescriptions..."
              className="w-72 rounded-xl pl-9"
            />
          </div>

          <Button variant="outline" size="icon" className="rounded-xl">
            <Bell className="size-4" />
          </Button>

          <div className="hidden items-center gap-3 border-l pl-3 sm:flex">
            <Avatar>
              <AvatarFallback>
                {getInitials(user.name || user.email)}
              </AvatarFallback>
            </Avatar>

            <div className="hidden leading-tight xl:block">
              <p className="text-sm font-medium">
                {user.name || user.email.split("@")[0]}
              </p>
              <p className="text-xs text-slate-500">{user.role || "USER"}</p>
            </div>
          </div>

          <Button
            variant="outline"
            className="rounded-xl"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 size-4" />
            )}
            Sign out
          </Button>
        </div>
      </div>
    </header>
  )
}