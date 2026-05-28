import {
    Bot,
    ClipboardList,
    ShieldAlert,
    Users,
    type LucideIcon,
  } from "lucide-react"
  
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { formatNumber } from "@/lib/utils"
  
  type StatsCardsProps = {
    patients: number
    pendingPrescriptions: number
    aiReviews: number
    safetyFlags: number
  }
  
  type StatItem = {
    title: string
    value: number
    change: string
    icon: LucideIcon
  }
  
  export function StatsCards({
    patients,
    pendingPrescriptions,
    aiReviews,
    safetyFlags,
  }: StatsCardsProps) {
    const stats: StatItem[] = [
      {
        title: "Active Patients",
        value: patients,
        change: "Total patient records",
        icon: Users,
      },
      {
        title: "Pending Prescriptions",
        value: pendingPrescriptions,
        change: "Waiting for review",
        icon: ClipboardList,
      },
      {
        title: "AI Reviews",
        value: aiReviews,
        change: "Logged assistant activity",
        icon: Bot,
      },
      {
        title: "Safety Flags",
        value: safetyFlags,
        change: "Requires pharmacist attention",
        icon: ShieldAlert,
      },
    ]
  
    return (
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
  
          return (
            <Card key={stat.title} className="rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-slate-500">
                  {stat.title}
                </CardTitle>
  
                <div className="rounded-xl bg-slate-100 p-2">
                  <Icon className="size-4 text-slate-700" />
                </div>
              </CardHeader>
  
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatNumber(stat.value)}
                </div>
                <p className="mt-1 text-sm text-slate-500">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </section>
    )
  }