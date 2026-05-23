"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bot,
  ClipboardList,
  LayoutDashboard,
  Pill,
  ShieldCheck,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Patients",
    href: "/dashboard/patients",
    icon: Users,
  },
  {
    label: "Prescriptions",
    href: "/dashboard/prescriptions",
    icon: ClipboardList,
  },
  {
    label: "Medications",
    href: "/dashboard/medications",
    icon: Pill,
  },
  {
    label: "AI Assistant",
    href: "/dashboard/assistant",
    icon: Bot,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden border-r bg-white lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <Pill className="size-5" />
          </div>

          <div>
            <p className="text-sm font-semibold leading-none">AgentShefa</p>
            <p className="text-xs text-slate-500">AI pharmacy system</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-300" />
              <p className="text-sm font-semibold">Safety Mode</p>
            </div>

            <p className="text-xs leading-5 text-slate-300">
              AI outputs are workflow support only. Clinical decisions require
              licensed review.
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}