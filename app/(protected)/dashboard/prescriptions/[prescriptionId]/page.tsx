import Link from "next/link"
import { notFound } from "next/navigation"
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Pill,
  Printer,
  ShieldAlert,
  Stethoscope,
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

type PrescriptionStatus =
  | "PENDING_REVIEW"
  | "READY_TO_FILL"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ON_HOLD"
  | "FLAGGED"

type PrescriptionPriority = "STANDARD" | "URGENT" | "CLINICAL_REVIEW"

type PrescriptionDetail = {
  id: string
  prescriptionNumber: string
  patientName: string
  patientId: string
  patientDob: string
  patientPhone: string
  patientAddress: string
  medicationName: string
  din: string
  dosage: string
  quantity: string
  refills: string
  route: string
  strength: string
  form: string
  prescriber: string
  prescriberLicense: string
  prescriberPhone: string
  submittedAt: string
  reviewedAt: string | null
  status: PrescriptionStatus
  priority: PrescriptionPriority
  clinicalFlags: string[]
  pharmacistNotes: string
  directions: string
  aiReviewSummary: string
}

const prescriptions: PrescriptionDetail[] = [
  {
    id: "rx_001",
    prescriptionNumber: "RX-2026-0001",
    patientName: "Sarah Ahmed",
    patientId: "PT-10042",
    patientDob: "1992-04-18",
    patientPhone: "(416) 555-0192",
    patientAddress: "Toronto, ON",
    medicationName: "Atorvastatin 20 mg Tablet",
    din: "00000005",
    dosage: "Take one tablet once daily",
    quantity: "30 tablets",
    refills: "3",
    route: "Oral",
    strength: "20 mg",
    form: "Tablet",
    prescriber: "Dr. Melissa Carter",
    prescriberLicense: "CPSO-204822",
    prescriberPhone: "(416) 555-0134",
    submittedAt: "Today, 9:42 AM",
    reviewedAt: null,
    status: "PENDING_REVIEW",
    priority: "CLINICAL_REVIEW",
    clinicalFlags: ["Drug interaction check", "Counselling required"],
    pharmacistNotes:
      "Patient should be counselled to report unexplained muscle pain or weakness. Confirm current medication list before dispensing.",
    directions:
      "Take one tablet by mouth once daily. May be taken with or without food.",
    aiReviewSummary:
      "AI review suggests pharmacist verification of cardiovascular medication history, counselling on muscle pain, and confirmation of interaction profile before final approval.",
  },
  {
    id: "rx_002",
    prescriptionNumber: "RX-2026-0002",
    patientName: "Daniel Wong",
    patientId: "PT-10043",
    patientDob: "1988-11-02",
    patientPhone: "(647) 555-0141",
    patientAddress: "Scarborough, ON",
    medicationName: "Amoxicillin 500 mg Capsule",
    din: "00000003",
    dosage: "Take one capsule every 8 hours",
    quantity: "21 capsules",
    refills: "0",
    route: "Oral",
    strength: "500 mg",
    form: "Capsule",
    prescriber: "Dr. Omar Khan",
    prescriberLicense: "CPSO-188320",
    prescriberPhone: "(416) 555-0177",
    submittedAt: "Today, 10:16 AM",
    reviewedAt: "Today, 10:28 AM",
    status: "READY_TO_FILL",
    priority: "STANDARD",
    clinicalFlags: ["Allergy check completed"],
    pharmacistNotes:
      "Confirm no penicillin allergy. Remind patient to complete full course.",
    directions: "Take one capsule by mouth every 8 hours until finished.",
    aiReviewSummary:
      "AI review found no major safety concerns in the provided context. Allergy verification remains required before dispensing.",
  },
  {
    id: "rx_003",
    prescriptionNumber: "RX-2026-0003",
    patientName: "Amina Rahman",
    patientId: "PT-10044",
    patientDob: "1975-08-22",
    patientPhone: "(905) 555-0188",
    patientAddress: "Mississauga, ON",
    medicationName: "Hydromorphone 2 mg Tablet",
    din: "00000009",
    dosage: "Take as prescribed for severe pain",
    quantity: "20 tablets",
    refills: "0",
    route: "Oral",
    strength: "2 mg",
    form: "Tablet",
    prescriber: "Dr. Evelyn Morris",
    prescriberLicense: "CPSO-114209",
    prescriberPhone: "(416) 555-0127",
    submittedAt: "Today, 11:04 AM",
    reviewedAt: null,
    status: "FLAGGED",
    priority: "URGENT",
    clinicalFlags: ["Controlled substance", "High-alert medication"],
    pharmacistNotes:
      "Requires controlled substance verification. Confirm indication, quantity, patient history, and prescriber authorization before dispensing.",
    directions: "Take exactly as directed by prescriber for severe pain.",
    aiReviewSummary:
      "AI review detected controlled substance and high-alert medication flags. Pharmacist must complete manual verification before fulfillment.",
  },
]

type PageProps = {
  params: Promise<{
    prescriptionId: string
  }>
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
        <CalendarClock className="mr-1 size-3" />
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

export default async function PrescriptionDetailsPage({ params }: PageProps) {
  const { prescriptionId } = await params

  const prescription = prescriptions.find((item) => item.id === prescriptionId)

  if (!prescription) {
    notFound()
  }

  return (
    <div className="space-y-6 text-slate-950">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative p-6 lg:p-8">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-slate-100 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-blue-50 blur-3xl" />

          <div className="relative space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <Button
                asChild
                variant="outline"
                className="w-fit rounded-xl border-slate-300 bg-white text-slate-950 hover:bg-slate-100 hover:text-slate-950"
              >
                <Link href="/dashboard/prescriptions">
                  <ArrowLeft className="mr-2 size-4" />
                  Back to Prescriptions
                </Link>
              </Button>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="rounded-xl border-slate-300 bg-white text-slate-950 hover:bg-slate-100 hover:text-slate-950"
                >
                  <Printer className="mr-2 size-4" />
                  Print
                </Button>

                <Button className="rounded-xl bg-slate-950 text-white hover:bg-slate-800">
                  <ClipboardCheck className="mr-2 size-4" />
                  Review Prescription
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-full border-slate-300 bg-white text-slate-950"
                  >
                    <ClipboardList className="mr-1 size-3" />
                    {prescription.prescriptionNumber}
                  </Badge>

                  {getStatusBadge(prescription.status)}
                  {getPriorityBadge(prescription.priority)}
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                    {prescription.patientName}
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-700">
                    Prescription profile for {prescription.medicationName}.
                    Review patient, prescriber, medication, clinical flags, and
                    pharmacist notes before fulfillment.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-950">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-700">
                  Submitted
                </p>
                <p className="mt-1 text-sm font-bold text-slate-950">
                  {prescription.submittedAt}
                </p>
                <p className="mt-2 text-xs font-semibold text-slate-700">
                  Reviewed: {prescription.reviewedAt ?? "Not reviewed yet"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DetailMetric
          title="Status"
          value={formatLabel(prescription.status)}
          description="Current workflow state"
          icon={ClipboardCheck}
        />

        <DetailMetric
          title="Priority"
          value={formatLabel(prescription.priority)}
          description="Review urgency"
          icon={AlertTriangle}
          warning={prescription.priority !== "STANDARD"}
        />

        <DetailMetric
          title="Clinical flags"
          value={String(prescription.clinicalFlags.length)}
          description="Review indicators"
          icon={ShieldAlert}
          danger={prescription.status === "FLAGGED"}
        />

        <DetailMetric
          title="Refills"
          value={prescription.refills}
          description="Remaining refills"
          icon={BadgeCheck}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card className="rounded-3xl border-slate-200 bg-white text-slate-950 shadow-sm">
            <CardHeader className="border-b border-slate-200 bg-slate-50/80">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950">
                <Pill className="size-5 text-slate-800" />
                Medication Details
              </CardTitle>
              <CardDescription className="text-sm font-medium text-slate-700">
                Medication, dosage, quantity, route, and dispensing details.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4 p-6 md:grid-cols-2">
              <InfoCard label="Medication" value={prescription.medicationName} />
              <InfoCard label="DIN" value={prescription.din} mono />
              <InfoCard label="Strength" value={prescription.strength} />
              <InfoCard label="Form" value={prescription.form} />
              <InfoCard label="Route" value={prescription.route} />
              <InfoCard label="Quantity" value={prescription.quantity} />
              <InfoCard label="Refills" value={prescription.refills} />
              <InfoCard label="Directions" value={prescription.directions} wide />
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white text-slate-950 shadow-sm">
            <CardHeader className="border-b border-slate-200 bg-slate-50/80">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950">
                <ShieldAlert className="size-5 text-slate-800" />
                Clinical Review
              </CardTitle>
              <CardDescription className="text-sm font-medium text-slate-700">
                Pharmacist-facing review flags and AI-assisted context.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 p-6">
              <div className="flex flex-wrap gap-2">
                {prescription.clinicalFlags.map((flag) => (
                  <Badge
                    key={flag}
                    variant="outline"
                    className="rounded-full border-slate-300 bg-white text-slate-950"
                  >
                    {flag}
                  </Badge>
                ))}
              </div>

              <ReviewBlock
                title="AI review summary"
                description={prescription.aiReviewSummary}
                icon={FileText}
              />

              <ReviewBlock
                title="Pharmacist notes"
                description={prescription.pharmacistNotes}
                icon={Stethoscope}
              />
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="rounded-3xl border-slate-200 bg-white text-slate-950 shadow-sm">
            <CardHeader className="border-b border-slate-200 bg-slate-50/80">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950">
                <User className="size-5 text-slate-800" />
                Patient
              </CardTitle>
              <CardDescription className="text-sm font-medium text-slate-700">
                Patient identity and contact details.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-6">
              <SideInfo label="Name" value={prescription.patientName} />
              <SideInfo label="Patient ID" value={prescription.patientId} />
              <SideInfo label="Date of birth" value={prescription.patientDob} />
              <SideInfo label="Phone" value={prescription.patientPhone} />
              <SideInfo label="Address" value={prescription.patientAddress} />
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white text-slate-950 shadow-sm">
            <CardHeader className="border-b border-slate-200 bg-slate-50/80">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950">
                <Stethoscope className="size-5 text-slate-800" />
                Prescriber
              </CardTitle>
              <CardDescription className="text-sm font-medium text-slate-700">
                Prescriber and authorization details.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-6">
              <SideInfo label="Name" value={prescription.prescriber} />
              <SideInfo
                label="License"
                value={prescription.prescriberLicense}
              />
              <SideInfo label="Phone" value={prescription.prescriberPhone} />
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white text-slate-950 shadow-sm">
            <CardHeader className="border-b border-slate-200 bg-slate-50/80">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950">
                <UploadCloud className="size-5 text-slate-800" />
                Source Document
              </CardTitle>
              <CardDescription className="text-sm font-medium text-slate-700">
                Uploaded prescription document placeholder.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <FileText className="mx-auto size-8 text-slate-800" />
                <p className="mt-3 text-sm font-bold text-slate-950">
                  Prescription document
                </p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  Connect this card to your upload/OCR workflow later.
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  )
}

type DetailMetricProps = {
  title: string
  value: string
  description: string
  icon: React.ElementType
  warning?: boolean
  danger?: boolean
}

function DetailMetric({
  title,
  value,
  description,
  icon: Icon,
  warning = false,
  danger = false,
}: DetailMetricProps) {
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
          <p className="mt-2 truncate text-lg font-bold tracking-tight text-slate-950">
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

function InfoCard({
  label,
  value,
  mono = false,
  wide = false,
}: {
  label: string
  value: string
  mono?: boolean
  wide?: boolean
}) {
  return (
    <div
      className={
        wide
          ? "rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2"
          : "rounded-2xl border border-slate-200 bg-white p-4"
      }
    >
      <p className="text-xs font-bold uppercase tracking-wide text-slate-700">
        {label}
      </p>
      <p
        className={
          mono
            ? "mt-1 break-words font-mono text-sm font-bold text-slate-950"
            : "mt-1 break-words text-sm font-bold text-slate-950"
        }
      >
        {value}
      </p>
    </div>
  )
}

function ReviewBlock({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: React.ElementType
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-2 text-slate-900">
          <Icon className="size-4" />
        </div>

        <div>
          <p className="text-sm font-bold text-slate-950">{title}</p>
          <p className="mt-1 text-sm font-medium leading-6 text-slate-700">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

function SideInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-700">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-bold text-slate-950">
        {value}
      </p>
    </div>
  )
}