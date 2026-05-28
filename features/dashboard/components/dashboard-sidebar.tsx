"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bot,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  Pill,
  Settings,
  ShieldCheck,
  Sparkles,
  UserCircle,
  Users,
  type LucideIcon,
} from "lucide-react"

import { APP_CONFIG, ROUTES } from "@/constants"
import { cn } from "@/lib/utils"

type SidebarItem = {
  label: string
  href: string
  icon: LucideIcon
  description?: string
}

type SidebarGroup = {
  label: string
  items: SidebarItem[]
}

const sidebarGroups: SidebarGroup[] = [
  {
    label: "Workspace",
    items: [
      {
        label: "Dashboard",
        href: ROUTES.DASHBOARD.ROOT,
        icon: LayoutDashboard,
        description: "Overview",
      },
      {
        label: "Patients",
        href: ROUTES.DASHBOARD.PATIENTS,
        icon: Users,
        description: "Patient profiles",
      },
      {
        label: "Prescriptions",
        href: ROUTES.DASHBOARD.PRESCRIPTIONS,
        icon: ClipboardList,
        description: "Review queue",
      },
      {
        label: "Medications",
        href: ROUTES.DASHBOARD.MEDICATIONS,
        icon: Pill,
        description: "Medication library",
      },
    ],
  },
  {
    label: "Intelligence",
    items: [
      {
        label: "AI Assistant",
        href: ROUTES.DASHBOARD.ASSISTANT,
        icon: Bot,
        description: "Workflow support",
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        label: "Profile",
        href: ROUTES.DASHBOARD.PROFILE,
        icon: UserCircle,
        description: "Your account",
      },
      {
        label: "Settings",
        href: ROUTES.DASHBOARD.SETTINGS,
        icon: Settings,
        description: "Preferences",
      },
    ],
  },
]

function isRouteActive(pathname: string, href: string) {
  if (href === ROUTES.DASHBOARD.ROOT) {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function SidebarNavItem({ item }: { item: SidebarItem }) {
  const pathname = usePathname()
  const Icon = item.icon
  const isActive = isRouteActive(pathname, item.href)

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition-all",
        "focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
        isActive
          ? "bg-slate-950 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      )}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl transition",
            isActive
              ? "bg-white/10 text-white"
              : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-950"
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>

        <span className="min-w-0">
          <span className="block truncate font-medium">{item.label}</span>
          {item.description ? (
            <span
              className={cn(
                "mt-0.5 hidden truncate text-xs sm:block",
                isActive ? "text-slate-300" : "text-slate-400"
              )}
            >
              {item.description}
            </span>
          ) : null}
        </span>
      </span>

      <ChevronRight
        className={cn(
          "size-4 shrink-0 transition",
          isActive
            ? "text-white"
            : "text-slate-300 opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100"
        )}
        aria-hidden="true"
      />
    </Link>
  )
}

export function DashboardSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen border-r border-slate-200 bg-white lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-200 px-5 py-5">
          <Link
            href={ROUTES.DASHBOARD.ROOT}
            className="flex items-center gap-3 rounded-2xl transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            aria-label={`${APP_CONFIG.name} dashboard home`}
          >
            <div className="relative flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
              <Pill className="size-5" aria-hidden="true" />
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-base font-semibold tracking-tight text-slate-950">
                {APP_CONFIG.name}
              </p>
              <p className="truncate text-xs text-slate-500">
                {APP_CONFIG.tagline}
              </p>
            </div>
          </Link>
        </div>

        <div className="pharma-scrollbar flex-1 overflow-y-auto px-3 py-4">
          <nav className="space-y-6" aria-label="Dashboard navigation">
            {sidebarGroups.map((group) => (
              <div key={group.label} className="space-y-2">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {group.label}
                </p>

                <div className="space-y-1">
                  {group.items.map((item) => (
                    <SidebarNavItem key={item.href} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  )
}