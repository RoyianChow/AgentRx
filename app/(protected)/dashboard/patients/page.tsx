import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CreatePatientDialog } from "@/features/patients/components/create-patient-dialog"
import { PatientDetailsDialog } from "@/features/patients/components/patient-details-dialog"
import { db } from "@/lib/db"
import { requireUser } from "@/lib/require-user"

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(value)
}

function formatLocation({
  city,
  province,
  postalCode,
}: {
  city?: string | null
  province?: string | null
  postalCode?: string | null
}) {
  const location = [city, province, postalCode].filter(Boolean).join(", ")

  return location || "No address added"
}

function getContactLabel({
  email,
  phone,
}: {
  email?: string | null
  phone?: string | null
}) {
  if (email) return email
  if (phone) return phone

  return "No contact added"
}

export default async function PatientsPage() {
  const user = await requireUser()

  const patients = await db.patient.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      fullName: true,
      phone: true,
      email: true,
      city: true,
      province: true,
      postalCode: true,
      preferredContactMethod: true,
      consentToCollectHealthInfo: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          prescriptions: true,
        },
      },
    },
    take: 20,
  })

  const totalPatients = patients.length

  const patientsWithContact = patients.filter(
    (patient) => patient.email || patient.phone
  ).length

  const patientsWithConsent = patients.filter(
    (patient) => patient.consentToCollectHealthInfo
  ).length

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              <ShieldCheck className="size-4" />
              Protected patient workspace
            </div>

            <h2 className="text-3xl font-semibold tracking-tight">
              Patients
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Manage patient intake profiles, contact information, consent
              records, and pharmacy workflow context. Full patient records
              require password confirmation before opening.
            </p>
          </div>

          <CreatePatientDialog />
        </div>

        <Separator className="my-6" />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">
                Total patients
              </p>
              <Users className="size-4 text-slate-400" />
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {totalPatients}
            </p>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">
                With contact info
              </p>
              <Phone className="size-4 text-slate-400" />
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {patientsWithContact}
            </p>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">
                Consent recorded
              </p>
              <CheckCircle2 className="size-4 text-slate-400" />
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {patientsWithConsent}
            </p>
          </div>
        </div>
      </section>

      {patients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No patients yet"
          description="Create your first patient profile to begin managing prescription workflows, medication history, coverage details, and pharmacist review context."
        />
      ) : (
        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader className="flex flex-col justify-between gap-4 border-b sm:flex-row sm:items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="size-5 text-slate-500" />
                Patient Records
              </CardTitle>

              <CardDescription className="mt-1">
                Latest patient profiles. Sensitive details are hidden until
                password confirmation is completed.
              </CardDescription>
            </div>

            <Badge variant="outline" className="w-fit rounded-full">
              Showing latest {patients.length}
            </Badge>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="group grid gap-4 p-4 transition hover:bg-slate-50 sm:p-5 lg:grid-cols-[1.4fr_1fr_auto]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold text-slate-950">
                        {patient.fullName}
                      </p>

                      {patient.consentToCollectHealthInfo ? (
                        <Badge
                          variant="outline"
                          className="rounded-full border-emerald-200 bg-emerald-50 text-emerald-700"
                        >
                          Consent on file
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="rounded-full border-amber-200 bg-amber-50 text-amber-700"
                        >
                          Consent missing
                        </Badge>
                      )}
                    </div>

                    <div className="mt-2 flex flex-col gap-1 text-sm text-slate-500">
                      <div className="flex min-w-0 items-center gap-2">
                        {patient.email ? (
                          <Mail className="size-4 shrink-0 text-slate-400" />
                        ) : (
                          <Phone className="size-4 shrink-0 text-slate-400" />
                        )}
                        <span className="truncate">
                          {getContactLabel({
                            email: patient.email,
                            phone: patient.phone,
                          })}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-center gap-2">
                        <MapPin className="size-4 shrink-0 text-slate-400" />
                        <span className="truncate">
                          {formatLocation({
                            city: patient.city,
                            province: patient.province,
                            postalCode: patient.postalCode,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2 text-sm text-slate-500 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-slate-400" />
                      <span>Created {formatDate(patient.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock3 className="size-4 text-slate-400" />
                      <span>Updated {formatDate(patient.updatedAt)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <ShieldCheck className="size-4 text-slate-400" />
                      <span>
                        {patient._count.prescriptions} prescription
                        {patient._count.prescriptions === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-start lg:justify-end">
                    <PatientDetailsDialog
                      patientId={patient.id}
                      patientName={patient.fullName}
                      currentUserEmail={user.email}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
        <div className="mb-1 flex items-center gap-2 font-semibold">
          <ShieldCheck className="size-4" />
          Development safety note
        </div>
        <p>
          Use synthetic patient data only at this stage. Real Ontario patient
          data requires a proper privacy, security, access-control, and
          compliance review before collection or storage.
        </p>
      </div>
    </div>
  )
}