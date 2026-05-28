import Link from "next/link"
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  FileText,
  Plus,
  Search,
  ShieldAlert,
  UploadCloud,
  User,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type PrescriptionStatus =
  | "PENDING_REVIEW"
  | "READY_TO_FILL"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ON_HOLD"
  | "FLAGGED"

type PrescriptionPriority = "STANDARD" | "URGENT" | "CLINICAL_REVIEW"

type PrescriptionRow = {
  id: string
  prescriptionNumber: string
  patientName: string
  patientId: string
  medicationName: string
  dosage: string
  prescriber: string
  submittedAt: string
  status: PrescriptionStatus
  priority: PrescriptionPriority
  flags: string[]
}

const prescriptions: PrescriptionRow[] = [
  {
    id: "rx_001",
    prescriptionNumber: "RX-2026-0001",
    patientName: "Sarah Ahmed",
    patientId: "PT-10042",
    medicationName: "Atorvastatin 20 mg Tablet",
    dosage: "Take one tablet once daily",
    prescriber: "Dr. Melissa Carter",
    submittedAt: "Today, 9:42 AM",
    status: "PENDING_REVIEW",
    priority: "CLINICAL_REVIEW",
    flags: ["Drug interaction check", "Counselling required"],
  },
  {
    id: "rx_002",
    prescriptionNumber: "RX-2026-0002",
    patientName: "Daniel Wong",
    patientId: "PT-10043",
    medicationName: "Amoxicillin 500 mg Capsule",
    dosage: "Take one capsule every 8 hours",
    prescriber: "Dr. Omar Khan",
    submittedAt: "Today, 10:16 AM",
    status: "READY_TO_FILL",
    priority: "STANDARD",
    flags: ["Allergy check completed"],
  },
  {
    id: "rx_003",
    prescriptionNumber: "RX-2026-0003",
    patientName: "Amina Rahman",
    patientId: "PT-10044",
    medicationName: "Hydromorphone 2 mg Tablet",
    dosage: "Take as prescribed for severe pain",
    prescriber: "Dr. Evelyn Morris",
    submittedAt: "Today, 11:04 AM",
    status: "FLAGGED",
    priority: "URGENT",
    flags: ["Controlled substance", "High-alert medication"],
  },
  {
    id: "rx_004",
    prescriptionNumber: "RX-2026-0004",
    patientName: "Michael Chen",
    patientId: "PT-10045",
    medicationName: "Metformin 500 mg Tablet",
    dosage: "Take one tablet twice daily with meals",
    prescriber: "Dr. Priya Shah",
    submittedAt: "Yesterday, 4:31 PM",
    status: "COMPLETED",
    priority: "STANDARD",
    flags: ["No active flags"],
  },
]

const stats = {
  total: prescriptions.length,
  pending: prescriptions.filter(
    (prescription) => prescription.status === "PENDING_REVIEW"
  ).length,
  ready: prescriptions.filter(
    (prescription) => prescription.status === "READY_TO_FILL"
  ).length,
  flagged: prescriptions.filter(
    (prescription) => prescription.status === "FLAGGED"
  ).length,
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function getStatusBadge(status: PrescriptionStatus) {
  if (status === "COMPLETED") {
    return (
      <Badge
        variant="outline"
        className="rounded-full border-emerald-300 bg-emerald-50 text-emerald-950"
      >
        <CheckCircle2 className="mr-1 size-3" />
        Completed
      </Badge>
    )
  }

  if (status === "READY_TO_FILL") {
    return (
      <Badge
        variant="outline"
        className="rounded-full border-blue-300 bg-blue-50 text-blue-950"
      >
        <ClipboardCheck className="mr-1 size-3" />
        Ready to fill
      </Badge>
    )
  }

  if (status === "PENDING_REVIEW") {
    return (
      <Badge
        variant="outline"
        className="rounded-full border-amber-300 bg-amber-50 text-amber-950"
      >
        <Clock3 className="mr-1 size-3" />
        Pending review
      </Badge>
    )
  }

  if (status === "FLAGGED") {
    return (
      <Badge
        variant="outline"
        className="rounded-full border-red-300 bg-red-50 text-red-950"
      >
        <ShieldAlert className="mr-1 size-3" />
        Flagged
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="rounded-full border-slate-300 bg-slate-50 text-slate-950"
    >
      {formatLabel(status)}
    </Badge>
  )
}

function getPriorityBadge(priority: PrescriptionPriority) {
  if (priority === "URGENT") {
    return (
      <Badge
        variant="outline"
        className="rounded-full border-red-300 bg-red-50 text-red-950"
      >
        Urgent
      </Badge>
    )
  }

  if (priority === "CLINICAL_REVIEW") {
    return (
      <Badge
        variant="outline"
        className="rounded-full border-amber-300 bg-amber-50 text-amber-950"
      >
        Clinical review
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="rounded-full border-slate-300 bg-white text-slate-950"
    >
      Standard
    </Badge>
  )
}

export default function PrescriptionsPage() {
  return (
    <div className="space-y-6 text-slate-950">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative p-6 lg:p-8">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-slate-100 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-blue-50 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full border-slate-300 bg-white text-slate-950"
                >
                  <ClipboardList className="mr-1 size-3" />
                  AgentRx Prescription Workflow
                </Badge>

                <Badge
                  variant="outline"
                  className="rounded-full border-emerald-300 bg-emerald-50 text-emerald-950"
                >
                  <CheckCircle2 className="mr-1 size-3" />
                  Queue active
                </Badge>
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Prescriptions
                </h1>
                <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-700">
                  Review prescription submissions, verify medication details,
                  monitor clinical flags, and move prescriptions through the
                  pharmacy workflow.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="rounded-xl border-slate-300 bg-white text-slate-950 hover:bg-slate-100 hover:text-slate-950"
              >
                <UploadCloud className="mr-2 size-4" />
                Upload Prescription
              </Button>

              <Button className="rounded-xl bg-slate-950 text-white hover:bg-slate-800">
                <Plus className="mr-2 size-4" />
                New Prescription
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PrescriptionMetric
          title="Total queue"
          value={stats.total}
          description="Prescription records"
          icon={FileText}
        />

        <PrescriptionMetric
          title="Pending review"
          value={stats.pending}
          description="Needs pharmacist review"
          icon={Clock3}
          warning={stats.pending > 0}
        />

        <PrescriptionMetric
          title="Ready to fill"
          value={stats.ready}
          description="Approved for fulfillment"
          icon={ClipboardCheck}
        />

        <PrescriptionMetric
          title="Flagged"
          value={stats.flagged}
          description="Clinical or safety attention"
          icon={ShieldAlert}
          danger={stats.flagged > 0}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden rounded-3xl border-slate-200 bg-white text-slate-950 shadow-sm">
          <CardHeader className="border-b border-slate-200 bg-slate-50/80">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950">
                  <ClipboardList className="size-5 text-slate-800" />
                  Prescription Queue
                </CardTitle>
                <CardDescription className="mt-1 text-sm font-medium text-slate-700">
                  Click any prescription row to open the full prescription
                  profile.
                </CardDescription>
              </div>

              <div className="relative min-w-0 xl:w-[360px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-700" />
                <Input
                  placeholder="Search patient, RX, medication..."
                  className="h-10 rounded-xl border-slate-300 bg-white pl-9 text-slate-950 placeholder:text-slate-500 focus-visible:border-slate-950 focus-visible:ring-slate-950/20"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-slate-200">
              <div className="hidden bg-white px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-700 xl:grid xl:grid-cols-[1.1fr_1.45fr_0.9fr_1fr] xl:gap-6">
                <div>Patient / RX</div>
                <div>Medication / Flags</div>
                <div>Prescriber</div>
                <div>Status / Priority</div>
              </div>

              {prescriptions.map((prescription) => (
                <Link
                  key={prescription.id}
                  href={`/dashboard/prescriptions/${prescription.id}`}
                  className="block outline-none transition hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-950/20"
                >
                  <article className="grid gap-5 px-5 py-5 xl:grid-cols-[1.1fr_1.45fr_0.9fr_1fr] xl:items-start xl:gap-6">
                    <div className="min-w-0">
                      <MobileLabel>Patient / RX</MobileLabel>

                      <div className="flex gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-950">
                          <User className="size-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="break-words text-base font-bold text-slate-950">
                            {prescription.patientName}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge
                              variant="outline"
                              className="rounded-full border-slate-300 bg-white font-mono text-slate-950"
                            >
                              {prescription.patientId}
                            </Badge>

                            <Badge
                              variant="outline"
                              className="rounded-full border-slate-300 bg-slate-50 font-mono text-slate-950"
                            >
                              {prescription.prescriptionNumber}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <MobileLabel>Medication / Flags</MobileLabel>

                      <p className="break-words text-base font-bold text-slate-950">
                        {prescription.medicationName}
                      </p>

                      <p className="mt-1 break-words text-sm font-medium leading-6 text-slate-700">
                        {prescription.dosage}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {prescription.flags.map((flag) => (
                          <Badge
                            key={flag}
                            variant="outline"
                            className="rounded-full border-slate-300 bg-white text-slate-950"
                          >
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <MobileLabel>Prescriber</MobileLabel>

                      <p className="break-words text-sm font-bold text-slate-950">
                        {prescription.prescriber}
                      </p>

                      <p className="mt-2 text-sm font-medium leading-5 text-slate-700">
                        Submitted {prescription.submittedAt}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <MobileLabel>Status / Priority</MobileLabel>

                      <div className="flex flex-wrap gap-2">
                        {getStatusBadge(prescription.status)}
                        {getPriorityBadge(prescription.priority)}
                      </div>

                      <p className="mt-3 text-xs font-semibold text-slate-700">
                        Open details →
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <aside className="space-y-6">
          <Card className="rounded-3xl border-slate-200 bg-white text-slate-950 shadow-sm">
            <CardHeader className="border-b border-slate-200 bg-slate-50/80">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950">
                <AlertTriangle className="size-5 text-slate-800" />
                Review Priorities
              </CardTitle>
              <CardDescription className="text-sm font-medium text-slate-700">
                Items that need attention before fulfillment.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-5">
              <PriorityItem
                title="Controlled substance review"
                description="Verify authorization, prescriber details, and dispensing rules."
                tone="danger"
              />
              <PriorityItem
                title="Counselling required"
                description="Confirm patient counselling notes before completion."
                tone="warning"
              />
              <PriorityItem
                title="Drug interaction check"
                description="Review medication history and active safety flags."
                tone="warning"
              />
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white text-slate-950 shadow-sm">
            <CardHeader className="border-b border-slate-200 bg-slate-50/80">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950">
                <CalendarClock className="size-5 text-slate-800" />
                Workflow Summary
              </CardTitle>
              <CardDescription className="text-sm font-medium text-slate-700">
                Today’s prescription processing overview.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-5">
              <WorkflowItem label="Average review time" value="8 min" />
              <WorkflowItem
                label="Ready for fulfillment"
                value={String(stats.ready)}
              />
              <WorkflowItem
                label="Clinical review queue"
                value={String(stats.pending)}
              />
              <WorkflowItem
                label="Safety flagged records"
                value={String(stats.flagged)}
              />
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  )
}

type PrescriptionMetricProps = {
  title: string
  value: number
  description: string
  icon: React.ElementType
  warning?: boolean
  danger?: boolean
}

function PrescriptionMetric({
  title,
  value,
  description,
  icon: Icon,
  warning = false,
  danger = false,
}: PrescriptionMetricProps) {
  const iconClassName = danger
    ? "border-red-200 bg-red-50 text-red-950"
    : warning
      ? "border-amber-200 bg-amber-50 text-amber-950"
      : "border-slate-200 bg-slate-50 text-slate-900"

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-950 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-700">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-700">
            {description}
          </p>
        </div>

        <div className={`rounded-xl border p-2 ${iconClassName}`}>
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  )
}

function PriorityItem({
  title,
  description,
  tone,
}: {
  title: string
  description: string
  tone: "warning" | "danger"
}) {
  const iconClassName =
    tone === "danger"
      ? "border-red-200 bg-red-50 text-red-950"
      : "border-amber-200 bg-amber-50 text-amber-950"

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex gap-3">
        <div className={`rounded-xl border p-2 ${iconClassName}`}>
          <AlertTriangle className="size-4" />
        </div>

        <div>
          <p className="text-sm font-bold text-slate-950">{title}</p>
          <p className="mt-1 text-sm font-medium leading-5 text-slate-700">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

function WorkflowItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <Badge
        variant="outline"
        className="rounded-full border-slate-300 bg-slate-50 text-slate-950"
      >
        {value}
      </Badge>
    </div>
  )
}

function MobileLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-700 xl:hidden">
      {children}
    </p>
  )
}