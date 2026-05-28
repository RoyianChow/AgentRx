"use client"

import { useMemo, useState, useTransition } from "react"
import type { KeyboardEvent, ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Loader2,
  PackageSearch,
  Search,
  ShieldAlert,
  Snowflake,
  Trash2,
  X,
} from "lucide-react"

import { deleteMedication } from "@/features/medications/actions/actions"
import { MedicationDetailsDialog } from "@/features/medications/components/medication-details-dialog"
import { MedicationDialog } from "@/features/medications/components/medication-dialog"
import { MedicationPasswordDialog } from "@/features/medications/components/medication-password-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type { MedicationRow } from "@/features/medications/components/medications-client"

type MedicationsTableProps = {
  medications: MedicationRow[]
  onOptimisticUpdate?: (medication: MedicationRow) => void
  onUpdateFailed?: (previousMedication: MedicationRow) => void
  onOptimisticDelete?: (id: string) => void
  onDeleteFailed?: (medication: MedicationRow) => void
}

type StockFilter =
  | "ALL"
  | "LOW_STOCK"
  | "IN_STOCK"
  | "HIGH_RISK"
  | "EXPIRING_SOON"

type SortOption = "NAME_ASC" | "STOCK_LOW" | "STATUS" | "EXPIRY_SOON"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

function formatLabel(value: string | null | undefined) {
  if (!value) return "—"

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
}

function getNumber(value: string | null | undefined) {
  const parsed = Number(value ?? "0")
  return Number.isFinite(parsed) ? parsed : 0
}

function getStatusBadgeVariant(status: string): BadgeVariant {
  switch (status) {
    case "ACTIVE":
      return "default"
    case "DISCONTINUED":
    case "RECALLED":
      return "destructive"
    case "BACKORDERED":
    case "ON_HOLD":
      return "secondary"
    default:
      return "outline"
  }
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

function getExpiryState(expiryDate: string | null) {
  if (!expiryDate) {
    return {
      label: "No expiry",
      isExpired: false,
      isExpiringSoon: false,
    }
  }

  const expiry = new Date(expiryDate)
  const today = new Date()

  if (Number.isNaN(expiry.getTime())) {
    return {
      label: expiryDate,
      isExpired: false,
      isExpiringSoon: false,
    }
  }

  today.setHours(0, 0, 0, 0)
  expiry.setHours(0, 0, 0, 0)

  const diffInDays = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  return {
    label: expiryDate,
    isExpired: diffInDays < 0,
    isExpiringSoon: diffInDays >= 0 && diffInDays <= 90,
  }
}

function matchesSearch(medication: MedicationRow, query: string) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) return true

  const searchableText = [
    medication.name,
    medication.din,
    medication.brandName,
    medication.genericName,
    medication.manufacturer,
    medication.strength,
    medication.form,
    medication.route,
    medication.storageLocation,
    medication.lotNumber,
    medication.status,
    medication.drugSchedule,
    medication.pharmacistNotes,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  return searchableText.includes(normalizedQuery)
}

function getSafetyBadges(medication: MedicationRow) {
  const badges: {
    label: string
    variant: BadgeVariant
    icon?: ReactNode
  }[] = []

  if (medication.isHighAlert) {
    badges.push({
      label: "High alert",
      variant: "destructive",
      icon: <AlertTriangle className="size-3" />,
    })
  }

  if (medication.controlledSubstance) {
    badges.push({
      label: "Controlled",
      variant: "secondary",
      icon: <ShieldAlert className="size-3" />,
    })
  }

  if (medication.requiresRefrigeration) {
    badges.push({
      label: "Cold chain",
      variant: "outline",
      icon: <Snowflake className="size-3" />,
    })
  }

  if (medication.requiresCounselling) {
    badges.push({
      label: "Counselling",
      variant: "outline",
    })
  }

  if (medication.isLookAlikeSoundAlike) {
    badges.push({
      label: "LASA",
      variant: "outline",
    })
  }

  return badges
}

export function MedicationsTable({
  medications,
  onOptimisticUpdate,
  onUpdateFailed,
  onOptimisticDelete,
  onDeleteFailed,
}: MedicationsTableProps) {
  const router = useRouter()

  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [stockFilter, setStockFilter] = useState<StockFilter>("ALL")
  const [sortBy, setSortBy] = useState<SortOption>("NAME_ASC")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedMedication, setSelectedMedication] =
    useState<MedicationRow | null>(null)

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [pendingDeleteMedication, setPendingDeleteMedication] =
    useState<MedicationRow | null>(null)

  const [isPending, startTransition] = useTransition()

  const statusOptions = useMemo(() => {
    const statuses = Array.from(
      new Set(medications.map((medication) => medication.status))
    ).sort()

    return ["ALL", ...statuses]
  }, [medications])

  const filteredMedications = useMemo(() => {
    const filtered = medications.filter((medication) => {
      const expiryState = getExpiryState(medication.expiryDate)

      const searchMatch = matchesSearch(medication, searchQuery)
      const statusMatch =
        statusFilter === "ALL" || medication.status === statusFilter

      const stockMatch =
        stockFilter === "ALL" ||
        (stockFilter === "LOW_STOCK" && isLowStock(medication)) ||
        (stockFilter === "IN_STOCK" && !isLowStock(medication)) ||
        (stockFilter === "HIGH_RISK" && isHighRisk(medication)) ||
        (stockFilter === "EXPIRING_SOON" && expiryState.isExpiringSoon)

      return searchMatch && statusMatch && stockMatch
    })

    return [...filtered].sort((a, b) => {
      if (sortBy === "STOCK_LOW") {
        return getNumber(a.stockQuantity) - getNumber(b.stockQuantity)
      }

      if (sortBy === "STATUS") {
        return a.status.localeCompare(b.status)
      }

      if (sortBy === "EXPIRY_SOON") {
        const aTime = a.expiryDate ? new Date(a.expiryDate).getTime() : Infinity
        const bTime = b.expiryDate ? new Date(b.expiryDate).getTime() : Infinity

        return aTime - bTime
      }

      return a.name.localeCompare(b.name)
    })
  }, [medications, searchQuery, statusFilter, stockFilter, sortBy])

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== "ALL" ||
    stockFilter !== "ALL" ||
    sortBy !== "NAME_ASC"

  function clearFilters() {
    setSearchQuery("")
    setStatusFilter("ALL")
    setStockFilter("ALL")
    setSortBy("NAME_ASC")
  }

  function handleRowKeyDown(
    event: KeyboardEvent<HTMLElement>,
    medication: MedicationRow
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      setSelectedMedication(medication)
    }
  }

  function handleDelete(medication: MedicationRow) {
    setPasswordError("")
    setPendingDeleteMedication(medication)
    setPasswordDialogOpen(true)
  }

  function confirmDelete(password: string) {
    const medication = pendingDeleteMedication

    if (!medication) return

    setMessage("")
    setPasswordError("")
    setDeletingId(medication.id)

    onOptimisticDelete?.(medication.id)

    startTransition(async () => {
      try {
        const result = await deleteMedication(medication.id, password)

        if (!result.success) {
          onDeleteFailed?.(medication)
          setPasswordError(result.message)
          setPasswordDialogOpen(true)
          return
        }

        setMessage(result.message)
        setPasswordDialogOpen(false)
        setPendingDeleteMedication(null)

        if (selectedMedication?.id === medication.id) {
          setSelectedMedication(null)
        }

        router.refresh()
      } catch (error) {
        console.error("Delete medication failed:", error)
        onDeleteFailed?.(medication)
        setPasswordError("Medication could not be deleted.")
        setPasswordDialogOpen(true)
      } finally {
        setDeletingId(null)
      }
    })
  }

  return (
    <div className="space-y-0">
      <MedicationDetailsDialog
        medication={selectedMedication}
        open={Boolean(selectedMedication)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMedication(null)
          }
        }}
      />

      <MedicationPasswordDialog
        open={passwordDialogOpen}
        title="Confirm medication deletion"
        description={
          pendingDeleteMedication
            ? `Enter the medication admin password to delete ${pendingDeleteMedication.name}.`
            : "Enter the medication admin password to continue."
        }
        confirmLabel="Delete medication"
        isPending={Boolean(deletingId)}
        error={passwordError}
        onOpenChange={(open) => {
          if (deletingId) return

          setPasswordDialogOpen(open)

          if (!open) {
            setPasswordError("")
            setPendingDeleteMedication(null)
          }
        }}
        onConfirm={confirmDelete}
      />

      <div className="border-b bg-slate-50/70 p-4 dark:bg-slate-950/40">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h3 className="text-sm font-semibold tracking-tight">
                Medication records
              </h3>
              <p className="text-xs text-muted-foreground">
                Showing {filteredMedications.length} of {medications.length}{" "}
                records. Click any row to view full details.
              </p>
            </div>

            {hasActiveFilters ? (
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-xl xl:self-start"
                onClick={clearFilters}
              >
                <X className="mr-2 size-4" />
                Clear filters
              </Button>
            ) : null}
          </div>

          <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_160px_170px_160px]">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search name, DIN, brand, generic, lot, notes..."
                className="h-10 rounded-xl bg-background pl-9"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 min-w-0 rounded-xl border border-input bg-background px-3 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "ALL" ? "All statuses" : formatLabel(status)}
                </option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(event) =>
                setStockFilter(event.target.value as StockFilter)
              }
              className="h-10 min-w-0 rounded-xl border border-input bg-background px-3 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="ALL">All inventory</option>
              <option value="LOW_STOCK">Low stock</option>
              <option value="IN_STOCK">In stock</option>
              <option value="HIGH_RISK">Safety flagged</option>
              <option value="EXPIRING_SOON">Expiring soon</option>
            </select>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="h-10 min-w-0 rounded-xl border border-input bg-background px-3 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="NAME_ASC">Name A-Z</option>
              <option value="STOCK_LOW">Lowest stock</option>
              <option value="STATUS">Status</option>
              <option value="EXPIRY_SOON">Earliest expiry</option>
            </select>
          </div>
        </div>
      </div>

      {message ? (
        <div className="border-b bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
          <div className="flex items-start justify-between gap-4">
            <p>{message}</p>
            <button
              type="button"
              onClick={() => setMessage("")}
              className="rounded-md p-1 text-emerald-700 transition hover:bg-emerald-100 dark:text-emerald-200 dark:hover:bg-emerald-900"
              aria-label="Dismiss message"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ) : null}

      <div className="divide-y">
        <div className="hidden bg-background px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground lg:grid lg:grid-cols-12 lg:gap-4">
          <div className="col-span-3">Medication</div>
          <div className="col-span-2">Inventory</div>
          <div className="col-span-2">Clinical</div>
          <div className="col-span-2">Storage</div>
          <div className="col-span-2">Safety</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {filteredMedications.length === 0 ? (
          <div className="flex min-h-[280px] items-center justify-center p-8">
            <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-3 text-center">
              <div className="rounded-2xl border bg-slate-50 p-4 dark:bg-slate-950">
                <PackageSearch className="size-8 text-muted-foreground" />
              </div>

              <div>
                <p className="font-medium">No medications found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try changing your search, status, inventory filter, or sort
                  selection.
                </p>
              </div>

              {hasActiveFilters ? (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              ) : null}
            </div>
          </div>
        ) : (
          filteredMedications.map((medication) => {
            const lowStock = isLowStock(medication)
            const isDeleting = deletingId === medication.id
            const expiryState = getExpiryState(medication.expiryDate)
            const safetyBadges = getSafetyBadges(medication)
            const visibleSafetyBadges = safetyBadges.slice(0, 3)
            const hiddenSafetyBadgeCount =
              safetyBadges.length - visibleSafetyBadges.length

            return (
              <article
                key={medication.id}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${medication.name}`}
                onClick={() => setSelectedMedication(medication)}
                onKeyDown={(event) => handleRowKeyDown(event, medication)}
                className="grid cursor-pointer gap-4 px-4 py-5 outline-none transition hover:bg-slate-50/80 focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-ring lg:grid-cols-12 lg:items-start dark:hover:bg-slate-950/50 dark:focus-visible:bg-slate-950/60"
              >
                <div className="min-w-0 lg:col-span-3">
                  <div className="flex gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border bg-slate-50 text-sm font-semibold text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-200">
                      {getInitials(medication.name)}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="break-words font-semibold leading-tight tracking-tight">
                          {medication.name}
                        </h4>

                        <Badge
                          variant={getStatusBadgeVariant(medication.status)}
                          className="rounded-full"
                        >
                          {formatLabel(medication.status)}
                        </Badge>
                      </div>

                      <p className="break-words text-sm text-muted-foreground">
                        {medication.brandName || medication.genericName ? (
                          <>
                            {medication.brandName ?? ""}
                            {medication.brandName && medication.genericName
                              ? " / "
                              : ""}
                            {medication.genericName ?? ""}
                          </>
                        ) : (
                          "No brand or generic name"
                        )}
                      </p>

                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="rounded-md border bg-background px-2 py-1 font-mono">
                          {medication.din ?? "No DIN"}
                        </span>

                        {medication.manufacturer ? (
                          <span className="rounded-md border bg-background px-2 py-1">
                            {medication.manufacturer}
                          </span>
                        ) : null}

                        {medication.lotNumber ? (
                          <span className="rounded-md border bg-background px-2 py-1 font-mono">
                            Lot {medication.lotNumber}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="min-w-0 space-y-2 lg:col-span-2">
                  <MobileLabel>Inventory</MobileLabel>

                  <div className="flex items-baseline gap-2">
                    <p className="text-xl font-semibold tracking-tight">
                      {medication.stockQuantity}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatLabel(medication.unitOfMeasure)}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {medication.reorderLevel
                      ? `Reorder at ${medication.reorderLevel}`
                      : "No reorder level set"}
                  </p>

                  {lowStock ? (
                    <Badge variant="destructive" className="rounded-full">
                      <AlertTriangle className="mr-1 size-3" />
                      Low stock
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="rounded-full">
                      <CheckCircle2 className="mr-1 size-3" />
                      Stock okay
                    </Badge>
                  )}
                </div>

                <div className="min-w-0 space-y-2 lg:col-span-2">
                  <MobileLabel>Clinical</MobileLabel>

                  <p className="break-words text-sm font-medium">
                    {medication.strength ?? "No strength"}
                  </p>

                  <p className="break-words text-sm text-muted-foreground">
                    {medication.form ?? "Unknown form"}
                    {medication.route ? ` · ${medication.route}` : ""}
                  </p>

                  <Badge variant="outline" className="rounded-full">
                    {formatLabel(medication.drugSchedule)}
                  </Badge>

                  {medication.dosage ? (
                    <p className="break-words text-xs text-muted-foreground">
                      {medication.dosage}
                    </p>
                  ) : null}
                </div>

                <div className="min-w-0 space-y-2 lg:col-span-2">
                  <MobileLabel>Storage</MobileLabel>

                  <p className="break-words text-sm font-medium">
                    {formatLabel(medication.storageRequirement)}
                  </p>

                  <p className="break-words text-sm text-muted-foreground">
                    {medication.storageLocation ?? "No location set"}
                  </p>

                  {expiryState.isExpired ? (
                    <Badge variant="destructive" className="rounded-full">
                      <Clock3 className="mr-1 size-3" />
                      Expired {expiryState.label}
                    </Badge>
                  ) : expiryState.isExpiringSoon ? (
                    <Badge variant="secondary" className="rounded-full">
                      <Clock3 className="mr-1 size-3" />
                      Expiring {expiryState.label}
                    </Badge>
                  ) : medication.expiryDate ? (
                    <Badge variant="outline" className="rounded-full">
                      Exp {expiryState.label}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="rounded-full">
                      No expiry
                    </Badge>
                  )}
                </div>

                <div className="min-w-0 space-y-2 lg:col-span-2">
                  <MobileLabel>Safety</MobileLabel>

                  <div className="flex flex-wrap gap-1.5">
                    {visibleSafetyBadges.length > 0 ? (
                      <>
                        {visibleSafetyBadges.map((badge) => (
                          <Badge
                            key={badge.label}
                            variant={badge.variant}
                            className="gap-1 rounded-full"
                          >
                            {badge.icon}
                            {badge.label}
                          </Badge>
                        ))}

                        {hiddenSafetyBadgeCount > 0 ? (
                          <Badge variant="outline" className="rounded-full">
                            +{hiddenSafetyBadgeCount} more
                          </Badge>
                        ) : null}
                      </>
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-1 rounded-full text-emerald-600"
                      >
                        <CheckCircle2 className="size-3" />
                        Standard
                      </Badge>
                    )}
                  </div>

                  {medication.pharmacistNotes ? (
                    <p className="break-words text-xs text-muted-foreground">
                      {medication.pharmacistNotes}
                    </p>
                  ) : null}
                </div>

                <div
                  className="flex min-w-0 justify-end gap-2 lg:col-span-1"
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  <MedicationDialog
                    mode="edit"
                    medication={medication}
                    onOptimisticUpdate={onOptimisticUpdate}
                    onUpdateFailed={onUpdateFailed}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="rounded-xl"
                    disabled={isPending || isDeleting}
                    onClick={() => handleDelete(medication)}
                  >
                    {isDeleting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                    <span className="sr-only">Delete medication</span>
                  </Button>
                </div>
              </article>
            )
          })
        )}
      </div>
    </div>
  )
}

function MobileLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground lg:hidden">
      {children}
    </p>
  )
}