import Link from "next/link"
import {
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  ShieldAlert,
  UserPlus,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ActivityType =
  | "ai_review"
  | "patient_created"
  | "prescription_updated"
  | "document_uploaded"
  | "safety_flag"
  | "system"

type ActivitySeverity = "info" | "success" | "warning" | "danger"

export type RecentActivityItem = {
  id: string
  type: ActivityType
  title: string
  description: string
  createdAt: Date | string
  severity?: ActivitySeverity
  actor?: {
    name: string
    role?: string
  }
  href?: string
}

type RecentActivityProps = {
  items?: RecentActivityItem[]
  title?: string
  description?: string
  maxItems?: number
  className?: string
}

const activityIconMap: Record<ActivityType, LucideIcon> = {
  ai_review: Bot,
  patient_created: UserPlus,
  prescription_updated: ClipboardCheck,
  document_uploaded: FileText,
  safety_flag: ShieldAlert,
  system: CheckCircle2,
}

const activityLabelMap: Record<ActivityType, string> = {
  ai_review: "AI Review",
  patient_created: "Patient",
  prescription_updated: "Prescription",
  document_uploaded: "Document",
  safety_flag: "Safety",
  system: "System",
}

const severityClassMap: Record<ActivitySeverity, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-red-200 bg-red-50 text-red-700",
}

const iconClassMap: Record<ActivitySeverity, string> = {
  info: "bg-blue-50 text-blue-700 ring-blue-100",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  warning: "bg-amber-50 text-amber-700 ring-amber-100",
  danger: "bg-red-50 text-red-700 ring-red-100",
}

const defaultActivity: RecentActivityItem[] = [
  {
    id: "act-001",
    type: "ai_review",
    title: "AI review completed",
    description:
      "AgentRx checked a prescription workflow and queued it for pharmacist verification.",
    createdAt: new Date(),
    severity: "success",
    actor: {
      name: "AgentRx",
      role: "AI Assistant",
    },
  },
  {
    id: "act-002",
    type: "patient_created",
    title: "Patient workspace initialized",
    description:
      "Patient records are ready to be connected with prescription and medication workflows.",
    createdAt: new Date(Date.now() - 1000 * 60 * 18),
    severity: "info",
    actor: {
      name: "System",
      role: "Platform",
    },
  },
  {
    id: "act-003",
    type: "safety_flag",
    title: "Safety review guardrail enabled",
    description:
      "Medication-related AI outputs require human review before clinical action.",
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    severity: "warning",
    actor: {
      name: "System",
      role: "Compliance",
    },
  },
]

function formatActivityTime(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value

  if (Number.isNaN(date.getTime())) {
    return "Unknown time"
  }

  const now = Date.now()
  const diffInSeconds = Math.floor((now - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  }).format(date)
}

function getActivitySeverity(item: RecentActivityItem): ActivitySeverity {
  if (item.severity) return item.severity

  if (item.type === "safety_flag") return "warning"
  if (item.type === "ai_review") return "success"

  return "info"
}

function ActivityRow({ item }: { item: RecentActivityItem }) {
  const Icon = activityIconMap[item.type] ?? CheckCircle2
  const severity = getActivitySeverity(item)

  const content = (
    <div className="flex gap-3 rounded-2xl border border-transparent p-3 transition hover:border-slate-200 hover:bg-slate-50">
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-2xl ring-1",
          iconClassMap[severity]
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-slate-950">{item.title}</p>

          <Badge
            variant="outline"
            className={cn("rounded-full text-[11px]", severityClassMap[severity])}
          >
            {activityLabelMap[item.type]}
          </Badge>
        </div>

        <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
          {item.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Clock3 className="size-3.5" aria-hidden="true" />
            {formatActivityTime(item.createdAt)}
          </span>

          {item.actor ? (
            <span>
              {item.actor.name}
              {item.actor.role ? ` · ${item.actor.role}` : ""}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )

  if (!item.href) {
    return content
  }

  return (
    <Link href={item.href} className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
      {content}
    </Link>
  )
}

function EmptyActivityState() {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed bg-slate-50 p-6 text-center">
      <div className="max-w-sm">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm">
          <CheckCircle2 className="size-5 text-slate-600" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-950">
          No recent activity
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Activity from AI reviews, patient updates, prescriptions, and safety
          checks will appear here.
        </p>
      </div>
    </div>
  )
}

export function RecentActivity({
  items = defaultActivity,
  title = "Recent Activity",
  description = "Latest workflow events, safety checks, and system updates.",
  maxItems = 6,
  className,
}: RecentActivityProps) {
  const visibleItems = items.slice(0, maxItems)

  return (
    <Card className={cn("rounded-2xl", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>

        <Badge variant="outline" className="rounded-full">
          {visibleItems.length} events
        </Badge>
      </CardHeader>

      <CardContent>
        {visibleItems.length === 0 ? (
          <EmptyActivityState />
        ) : (
          <div className="space-y-1" aria-label="Recent activity list">
            {visibleItems.map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}