"use client"

import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  ContactRound,
  Cross,
  FileText,
  HeartPulse,
  Hospital,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Stethoscope,
  UserRound,
  WalletCards,
} from "lucide-react"

import type { PatientSecureDetails } from "@/features/patients/actions/get-patient-details-action"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type PatientDetailsContentProps = {
  patient: PatientSecureDetails
}

type DetailItemProps = {
  label: string
  value?: string | null
  isSensitive?: boolean
}

type SectionShellProps = {
  icon: React.ElementType
  title: string
  description: string
  children: React.ReactNode
}

function formatDate(value?: string | null) {
  if (!value) return "Not provided"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "Not provided"

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

function displayValue(value?: string | null) {
  return value?.trim() || "Not provided"
}

function getBooleanLabel(value: boolean) {
  return value ? "Yes" : "No"
}

function getConsentBadgeClass(value: boolean) {
  return value
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-amber-200 bg-amber-50 text-amber-700"
}

function getContactSummary(patient: PatientSecureDetails) {
  if (patient.phone && patient.email) return "Phone + email available"
  if (patient.phone) return "Phone available"
  if (patient.email) return "Email available"

  return "No contact method on file"
}

function DetailItem({ label, value, isSensitive = false }: DetailItemProps) {
  const hasValue = Boolean(value?.trim())

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        {isSensitive ? (
          <ShieldCheck className="size-3.5 text-slate-400" aria-hidden="true" />
        ) : null}
      </div>

      <p
        className={`mt-1 break-words text-sm font-medium ${
          hasValue ? "text-slate-950" : "text-slate-400"
        }`}
      >
        {displayValue(value)}
      </p>
    </div>
  )
}

function DetailTextArea({
  label,
  value,
  isSensitive = false,
}: DetailItemProps) {
  const hasValue = Boolean(value?.trim())

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        {isSensitive ? (
          <ShieldCheck className="size-3.5 text-slate-400" aria-hidden="true" />
        ) : null}
      </div>

      <p
        className={`mt-2 whitespace-pre-wrap text-sm leading-6 ${
          hasValue ? "text-slate-700" : "text-slate-400"
        }`}
      >
        {displayValue(value)}
      </p>
    </div>
  )
}

function SectionShell({
  icon: Icon,
  title,
  description,
  children,
}: SectionShellProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border bg-slate-50 text-slate-700">
          <Icon className="size-4" aria-hidden="true" />
        </div>

        <div>
          <h4 className="font-semibold tracking-tight text-slate-950">
            {title}
          </h4>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  )
}

export function PatientDetailsContent({ patient }: PatientDetailsContentProps) {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-sm font-medium text-emerald-100">
                <ShieldCheck className="size-4" />
                Secure patient record unlocked
              </div>

              <div className="flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/15">
                  <UserRound className="size-6 text-white" />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-2xl font-semibold tracking-tight">
                    {patient.fullName}
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                    Patient intake profile for pharmacy workflow review,
                    prescription processing, coverage context, and care team
                    coordination.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-300">
                  Health info consent
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {getBooleanLabel(patient.consentToCollectHealthInfo)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-300">
                  Contact status
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {patient.consentToContact ? "Allowed" : "Not allowed"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="rounded-full border-white/15 bg-white/10 text-white"
            >
              <CalendarDays className="mr-1 size-3.5" />
              DOB: {formatDate(patient.dateOfBirth)}
            </Badge>

            <Badge
              variant="outline"
              className="rounded-full border-white/15 bg-white/10 text-white"
            >
              <Phone className="mr-1 size-3.5" />
              {displayValue(patient.phone)}
            </Badge>

            <Badge
              variant="outline"
              className="rounded-full border-white/15 bg-white/10 text-white"
            >
              <Mail className="mr-1 size-3.5" />
              {displayValue(patient.email)}
            </Badge>

            <Badge
              variant="outline"
              className={getConsentBadgeClass(
                patient.consentToCollectHealthInfo
              )}
            >
              <CheckCircle2 className="mr-1 size-3.5" />
              PHI consent{" "}
              {patient.consentToCollectHealthInfo ? "recorded" : "missing"}
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 bg-slate-50 p-5 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-4">
            <div className="flex items-center gap-2 text-slate-500">
              <ContactRound className="size-4" />
              <p className="text-sm font-medium">Contact</p>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-950">
              {getContactSummary(patient)}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Hospital className="size-4" />
              <p className="text-sm font-medium">Preferred pharmacy</p>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-950">
              {displayValue(patient.preferredPharmacy)}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-4">
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin className="size-4" />
              <p className="text-sm font-medium">Location</p>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-950">
              {[patient.city, patient.province, patient.postalCode]
                .filter(Boolean)
                .join(", ") || "Not provided"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
        <div className="mb-1 flex items-center gap-2 font-semibold">
          <AlertTriangle className="size-4" />
          Sensitive healthcare information
        </div>
        <p>
          This record may contain personal health information, coverage details,
          medication history, allergies, and care team notes. Access should be
          limited to authorized pharmacy staff and handled according to your
          privacy policy.
        </p>
      </div>

      <SectionShell
        icon={ContactRound}
        title="Contact and Address"
        description="Core communication and location information used for pharmacy workflow coordination."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <DetailItem label="Phone" value={patient.phone} />
          <DetailItem label="Email" value={patient.email} />
          <DetailItem label="Address line 1" value={patient.addressLine1} />
          <DetailItem label="Address line 2" value={patient.addressLine2} />
          <DetailItem label="City" value={patient.city} />
          <DetailItem label="Province" value={patient.province} />
          <DetailItem label="Postal code" value={patient.postalCode} />
          <DetailItem
            label="Preferred contact"
            value={patient.preferredContactMethod}
          />
        </div>
      </SectionShell>

      <Separator />

      <SectionShell
        icon={WalletCards}
        title="Coverage and Billing"
        description="Ontario coverage and payer information used for pharmacy intake and claim preparation."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <DetailItem
            label="Health card number"
            value={patient.healthCardNumber}
            isSensitive
          />
          <DetailItem
            label="Health card version"
            value={patient.healthCardVersion}
            isSensitive
          />
          <DetailItem
            label="Insurance provider"
            value={patient.insuranceProvider}
          />
          <DetailItem label="Drug plan ID" value={patient.drugPlanId} />
        </div>
      </SectionShell>

      <Separator />

      <SectionShell
        icon={HeartPulse}
        title="Clinical Intake"
        description="Patient-reported clinical context to support pharmacist review and medication workflow checks."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <DetailTextArea
            label="Allergies and sensitivities"
            value={patient.allergies}
            isSensitive
          />

          <DetailTextArea
            label="Medical conditions"
            value={patient.medicalConditions}
            isSensitive
          />

          <div className="md:col-span-2">
            <DetailTextArea
              label="Current medications"
              value={patient.currentMedications}
              isSensitive
            />
          </div>
        </div>
      </SectionShell>

      <Separator />

      <SectionShell
        icon={Stethoscope}
        title="Care Team"
        description="Prescriber and pharmacy context for clarifications and continuity of care."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <DetailItem
            label="Primary physician / prescriber"
            value={patient.primaryPhysicianName}
          />

          <DetailItem
            label="Physician / prescriber phone"
            value={patient.primaryPhysicianPhone}
          />

          <DetailItem
            label="Preferred pharmacy"
            value={patient.preferredPharmacy}
          />
        </div>
      </SectionShell>

      <Separator />

      <SectionShell
        icon={Cross}
        title="Emergency Contact"
        description="Caregiver or emergency contact information for support workflows."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <DetailItem
            label="Emergency contact"
            value={patient.emergencyContactName}
          />

          <DetailItem
            label="Emergency phone"
            value={patient.emergencyContactPhone}
          />

          <DetailItem
            label="Relationship"
            value={patient.emergencyContactRelationship}
          />
        </div>
      </SectionShell>

      <Separator />

      <SectionShell
        icon={FileText}
        title="Internal Pharmacy Notes"
        description="Operational notes for pharmacy staff. Avoid storing unnecessary sensitive information."
      >
        <DetailTextArea label="Notes" value={patient.notes} isSensitive />
      </SectionShell>

      <div className="flex flex-col gap-3 rounded-2xl border bg-slate-50 p-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="size-4 text-slate-400" />
          <span>Last updated: {formatDate(patient.updatedAt)}</span>
        </div>

        <span className="inline-flex items-center gap-2 font-medium text-emerald-700">
          <CheckCircle2 className="size-4" />
          Record unlocked for current view
        </span>
      </div>
    </div>
  )
}