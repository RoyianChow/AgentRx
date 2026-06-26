"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  Package,
  Pill,
  ShieldAlert,
  Snowflake,
} from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MedicationDialog } from "@/features/medications/components/medication-dialog"
import { MedicationsTable } from "@/features/medications/components/medications-table"

export type MedicationRow = {
  id: string
  name: string
  din: string | null
  brandName: string | null
  genericName: string | null
  manufacturer: string | null
  strength: string | null
  dosage: string | null
  form: string | null
  route: string | null
  description: string | null

  drugSchedule: string
  status: string
  storageRequirement: string

  stockQuantity: string
  reorderLevel: string | null
  unitOfMeasure: string
  storageLocation: string | null
  lotNumber: string | null
  expiryDate: string | null

  isHighAlert: boolean
  isLookAlikeSoundAlike: boolean
  requiresCounselling: boolean
  requiresRefrigeration: boolean
  controlledSubstance: boolean

  pharmacistNotes: string | null
}

type MedicationsClientProps = {
  initialMedications: MedicationRow[]
}

function getNumber(value: string | null | undefined) {
  const parsed = Number(value ?? "0")
  return Number.isFinite(parsed) ? parsed : 0
}

function isLowStock(medication: MedicationRow) {
  const stockQuantity = getNumber(medication.stockQuantity)
  const reorderLevel = getNumber(medication.reorderLevel)

  if (!reorderLevel) return false

  return stockQuantity <= reorderLevel
}

function isHighRisk(medication: MedicationRow) {
  return (
    medication.isHighAlert ||
    medication.controlledSubstance ||
    medication.isLookAlikeSoundAlike ||
    medication.requiresCounselling ||
    medication.requiresRefrigeration
  )
}

function isExpiringSoon(expiryDate: string | null) {
  if (!expiryDate) return false

  const expiry = new Date(expiryDate)
  const today = new Date()

  if (Number.isNaN(expiry.getTime())) return false

  today.setHours(0, 0, 0, 0)
  expiry.setHours(0, 0, 0, 0)

  const diffInDays = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  return diffInDays >= 0 && diffInDays <= 90
}

export function MedicationsClient({
  initialMedications,
}: MedicationsClientProps) {
  const [medications, setMedications] =
    useState<MedicationRow[]>(initialMedications)

  // Sync state if initialMedications changes (e.g. after refresh)
  const [prevInitialMedications, setPrevInitialMedications] = useState(initialMedications)
  if (initialMedications !== prevInitialMedications) {
    setPrevInitialMedications(initialMedications)
    setMedications(initialMedications)
  }

  const stats = useMemo(() => {
    return {
      total: medications.length,
      active: medications.filter((medication) => medication.status === "ACTIVE")
        .length,
      lowStock: medications.filter(isLowStock).length,
      highRisk: medications.filter(isHighRisk).length,
      refrigerated: medications.filter(
        (medication) => medication.requiresRefrigeration
      ).length,
      expiringSoon: medications.filter((medication) =>
        isExpiringSoon(medication.expiryDate)
      ).length,
    }
  }, [medications])

  const addMedication = useCallback((medication: MedicationRow) => {
    setMedications((current) => {
      const alreadyExists = current.some((item) => item.id === medication.id)

      if (alreadyExists) {
        return current.map((item) =>
          item.id === medication.id ? medication : item
        )
      }

      return [medication, ...current]
    })
  }, [])

  const replaceMedication = useCallback(
    (tempId: string, medication: MedicationRow) => {
      setMedications((current) => {
        const tempExists = current.some((item) => item.id === tempId)

        if (!tempExists) {
          const alreadyExists = current.some((item) => item.id === medication.id)

          if (alreadyExists) {
            return current.map((item) =>
              item.id === medication.id ? medication : item
            )
          }

          return [medication, ...current]
        }

        return current.map((item) => (item.id === tempId ? medication : item))
      })
    },
    []
  )

  const updateMedicationRow = useCallback((medication: MedicationRow) => {
    setMedications((current) =>
      current.map((item) => (item.id === medication.id ? medication : item))
    )
  }, [])

  const removeMedication = useCallback((id: string) => {
    setMedications((current) => current.filter((item) => item.id !== id))
  }, [])

  const restoreMedication = useCallback((medication: MedicationRow) => {
    setMedications((current) => {
      const alreadyExists = current.some((item) => item.id === medication.id)

      if (alreadyExists) {
        return current.map((item) =>
          item.id === medication.id ? medication : item
        )
      }

      return [medication, ...current]
    })
  }, [])

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center lg:p-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
              <Pill className="size-3.5" />
              AgentRx Inventory Control
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight">
                Medication Library
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-300">
                Manage DIN records, stock thresholds, storage requirements,
                safety flags, pharmacist notes, and medication identity data
                from one operational workspace.
              </p>
            </div>
          </div>

          <div className="flex justify-start lg:justify-end">
            <MedicationDialog
              mode="create"
              onOptimisticCreate={addMedication}
              onCreateConfirmed={replaceMedication}
              onCreateFailed={removeMedication}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard
          title="Total records"
          value={stats.total}
          description="Medication products"
          icon={Package}
        />

        <MetricCard
          title="Active"
          value={stats.active}
          description="Dispensable records"
          icon={CheckCircle2}
        />

        <MetricCard
          title="Low stock"
          value={stats.lowStock}
          description="At or below reorder"
          icon={AlertTriangle}
          isWarning={stats.lowStock > 0}
        />

        <MetricCard
          title="Safety flags"
          value={stats.highRisk}
          description="Needs review"
          icon={ShieldAlert}
          isWarning={stats.highRisk > 0}
        />

        <MetricCard
          title="Cold chain"
          value={stats.refrigerated}
          description="Refrigerated items"
          icon={Snowflake}
        />

        <MetricCard
          title="Expiring soon"
          value={stats.expiringSoon}
          description="Within 90 days"
          icon={AlertTriangle}
          isWarning={stats.expiringSoon > 0}
        />
      </section>

      {medications.length === 0 ? (
        <Card className="rounded-3xl border-dashed">
          <CardContent className="space-y-5 p-8">
            <EmptyState
              icon={Pill}
              title="No medications yet"
              description="Add medications to build the foundation for prescription workflows and AI review context."
              actionLabel="Add Medication"
            />

            <div className="flex justify-center">
              <MedicationDialog
                mode="create"
                onOptimisticCreate={addMedication}
                onCreateConfirmed={replaceMedication}
                onCreateFailed={removeMedication}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-3xl shadow-sm">
          <CardHeader className="border-b">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Inventory Workspace</CardTitle>
                <CardDescription>
                  Search, filter, review, edit, and remove medication records
                  without horizontal table scrolling.
                </CardDescription>
              </div>

              <div className="text-sm text-muted-foreground">
                {medications.length} medication
                {medications.length === 1 ? "" : "s"} loaded
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <MedicationsTable
              medications={medications}
              onOptimisticUpdate={updateMedicationRow}
              onUpdateFailed={updateMedicationRow}
              onOptimisticDelete={removeMedication}
              onDeleteFailed={restoreMedication}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

type MetricCardProps = {
  title: string
  value: number
  description: string
  icon: React.ElementType
  isWarning?: boolean
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  isWarning = false,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border bg-background p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>

        <div
          className={
            isWarning
              ? "rounded-xl bg-destructive/10 p-2 text-destructive"
              : "rounded-xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300"
          }
        >
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  )
}