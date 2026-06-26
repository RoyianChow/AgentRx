import { Bot, CalendarClock, ShieldCheck } from "lucide-react"

import { AiReviewCard } from "@/features/dashboard/components/ai-review-card"
import { PrescriptionQueue } from "@/features/dashboard/components/prescription-queue"
import { RecentActivity } from "@/features/dashboard/components/recent-activity"
import { StatsCards } from "@/features/dashboard/components/stats-cards"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getDashboardSummary } from "@/features/dashboard/queries/dashboard-queries"
import { APP_CONFIG } from "@/constants"

export default async function DashboardPage() {
  const summary = await getDashboardSummary()

  return (
    <div className="space-y-6">
      <StatsCards
        patients={summary.patientCount}
        pendingPrescriptions={summary.pendingPrescriptionCount}
        aiReviews={summary.aiReviewCount}
        safetyFlags={summary.safetyFlagCount}
      />

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <PrescriptionQueue />

        <div className="space-y-6">
          <AiReviewCard />

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Today&apos;s Schedule</CardTitle>
              <CardDescription>
                Upcoming reviews and pickup windows.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-2">
                  <CalendarClock className="size-4 text-slate-700" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Pharmacist review block
                  </p>
                  <p className="text-sm text-slate-500">2:00 PM - 3:30 PM</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-2">
                  <ShieldCheck className="size-4 text-slate-700" />
                </div>

                <div>
                  <p className="text-sm font-medium">Safety checks</p>
                  <p className="text-sm text-slate-500">
                    No confirmed safety flags yet.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <RecentActivity />

        <Card className="rounded-2xl border-slate-900 bg-slate-950 text-white">
          <CardHeader>
            <CardTitle>AI Assistant Preview</CardTitle>
            <CardDescription className="text-slate-300">
              This will connect to your Python agent service later.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Bot className="size-4 text-emerald-300" />
                <p className="text-sm font-medium">                  {APP_CONFIG.name}
                Assistant</p>
              </div>

              <p className="text-sm leading-6 text-slate-200">
                I can help organize prescription workflows, summarize patient
                context, and flag items for pharmacist review once connected to
                the agent service.
              </p>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Ask AgentRx..."
                className="rounded-xl border-white/20 bg-white/10 text-white placeholder:text-slate-400"
              />
              <Button className="rounded-xl bg-white text-slate-950 hover:bg-slate-100">
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}