import type { ReactNode } from "react"

import { DashboardHeader } from "@/features/dashboard/components/dashboard-header"
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar"
import { requireUser } from "@/lib/require-user"

export async function ProtectedLayout({ children }: { children: ReactNode }) {
  const user = await requireUser()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <DashboardSidebar />

        <div className="flex min-w-0 flex-col">
          <DashboardHeader
            user={{
              name: user.name ?? null,
              email: user.email,
              role: user.role ?? "USER",
            }}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}