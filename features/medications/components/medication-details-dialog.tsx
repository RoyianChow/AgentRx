"use client"

import type { ReactNode } from "react"
import {
  Activity,
  AlertTriangle,
  Barcode,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileText,
  MapPin,
  Package,
  Pill,
  ShieldAlert,
  Snowflake,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import type { MedicationRow } from "@/features/medications/components/medications-client"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

type MedicationDetailsDialogProps = {
  medication: MedicationRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

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

function isLowStock(medication: MedicationRow) {
  const stockQuantity = getNumber(medication.stockQuantity)
  const reorderLevel = getNumber(medication.reorderLevel)

  if (!reorderLevel) return false

  return stockQuantity <= reorderLevel
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

function getExpiryState(expiryDate: string | null) {
  if (!expiryDate) {
    return {
      label: "No expiry",
      daysUntilExpiry: null as number | null,
      isExpired: false,
      isExpiringSoon: false,
    }
  }

  const expiry = new Date(expiryDate)
  const today = new Date()

  if (Number.isNaN(expiry.getTime())) {
    return {
      label: expiryDate,
      daysUntilExpiry: null as number | null,
      isExpired: false,
      isExpiringSoon: false,
    }
  }

  today.setHours(0, 0, 0, 0)
  expiry.setHours(0, 0, 0, 0)

  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  return {
    label: expiryDate,
    daysUntilExpiry,
    isExpired: daysUntilExpiry < 0,
    isExpiringSoon: daysUntilExpiry >= 0 && daysUntilExpiry <= 90,
  }
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

function getProfileCompletion(medication: MedicationRow) {
  const fields = [
    medication.name,
    medication.din,
    medication.brandName,
    medication.genericName,
    medication.manufacturer,
    medication.strength,
    medication.dosage,
    medication.form,
    medication.route,
    medication.drugSchedule,
    medication.status,
    medication.storageRequirement,
    medication.stockQuantity,
    medication.reorderLevel,
    medication.unitOfMeasure,
    medication.storageLocation,
    medication.lotNumber,
    medication.expiryDate,
    medication.pharmacistNotes,
    medication.description,
  ]

  const completed = fields.filter((field) => {
    if (typeof field !== "string") return Boolean(field)
    return field.trim().length > 0
  }).length

  return Math.round((completed / fields.length) * 100)
}

function getRiskProfile(medication: MedicationRow) {
  const lowStock = isLowStock(medication)
  const expiryState = getExpiryState(medication.expiryDate)

  if (
    medication.isHighAlert ||
    medication.controlledSubstance ||
    expiryState.isExpired
  ) {
    return {
      label: "Critical review",
      description: "This record contains high-priority safety or expiry flags.",
      className:
        "border-destructive/25 bg-destructive/10 text-destructive dark:bg-destructive/15",
      icon: <ShieldAlert className="size-4" />,
    }
  }

  if (
    lowStock ||
    expiryState.isExpiringSoon ||
    medication.requiresCounselling ||
    medication.isLookAlikeSoundAlike ||
    medication.requiresRefrigeration
  ) {
    return {
      label: "Needs monitoring",
      description: "This record has inventory, storage, or counselling flags.",
      className:
        "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
      icon: <AlertTriangle className="size-4" />,
    }
  }

  return {
    label: "Standard profile",
    description: "No major inventory or safety flags are currently present.",
    className:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    icon: <CheckCircle2 className="size-4" />,
  }
}

export function MedicationDetailsDialog({
  medication,
  open,
  onOpenChange,
}: MedicationDetailsDialogProps) {
  if (!medication) return null

  const lowStock = isLowStock(medication)
  const expiryState = getExpiryState(medication.expiryDate)
  const safetyBadges = getSafetyBadges(medication)
  const completionScore = getProfileCompletion(medication)
  const riskProfile = getRiskProfile(medication)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
     <DialogContent className="max-h-[92vh] overflow-hidden rounded-3xl border bg-background p-1 shadow-2xl sm:max-w-5xl">
     <div className="clean-scrollbar max-h-[calc(92vh-0.75rem)] overflow-y-auto rounded-[1.35rem]">
        <div className="overflow-hidden rounded-t-3xl border-b bg-gradient-to-br from-slate-150 via-slate-100 to-slate-100 text-black">
          <DialogHeader className="space-y-0 p-6 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-lg font-semibold shadow-sm">
                  {getInitials(medication.name)}
                </div>

                <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="rounded-full bg-white/10 text-black hover:bg-white/10">
                      <Pill className="mr-1 size-3" />
                      Medication profile
                    </Badge>

                    <Badge
                      variant={getStatusBadgeVariant(medication.status)}
                      className="rounded-full"
                    >
                      {formatLabel(medication.status)}
                    </Badge>
                  </div>

                  <div>
                    <DialogTitle className="break-words text-2xl font-semibold tracking-tight text-black sm:text-3xl">
                      {medication.name}
                    </DialogTitle>

                    <DialogDescription className="mt-2 max-w-2xl text-sm leading-6 text-slate-800">
                      {medication.brandName || medication.genericName ? (
                        <>
                          {medication.brandName ?? ""}
                          {medication.brandName && medication.genericName
                            ? " / "
                            : ""}
                          {medication.genericName ?? ""}
                        </>
                      ) : (
                        "Full medication inventory, clinical, storage, and safety profile."
                      )}
                    </DialogDescription>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-slate-900">
                    <HeaderChip
                      icon={<Barcode className="size-3.5" />}
                      label={medication.din ?? "No DIN"}
                    />
                    <HeaderChip
                      icon={<Building2 className="size-3.5" />}
                      label={medication.manufacturer ?? "No manufacturer"}
                    />
                    <HeaderChip
                      icon={<Package className="size-3.5" />}
                      label={`${medication.stockQuantity} ${formatLabel(
                        medication.unitOfMeasure
                      )}`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-700">
                    Profile completion
                  </p>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="text-2xl font-semibold">{completionScore}%</p>
                    <Activity className="size-5 text-slate-300" />
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-white"
                      style={{ width: `${completionScore}%` }}
                    />
                  </div>
                </div>

                <div className={`rounded-2xl border p-4 ${riskProfile.className}`}>
                  <div className="flex items-center gap-2">
                    {riskProfile.icon}
                    <p className="text-sm font-semibold">{riskProfile.label}</p>
                  </div>
                  <p className="mt-2 text-xs leading-5 opacity-90">
                    {riskProfile.description}
                  </p>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="space-y-5 p-6 lg:p-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricTile
              icon={<Package className="size-5" />}
              title="Stock"
              value={`${medication.stockQuantity} ${formatLabel(
                medication.unitOfMeasure
              )}`}
              description={
                medication.reorderLevel
                  ? `Reorder at ${medication.reorderLevel}`
                  : "No reorder level"
              }
              tone={lowStock ? "danger" : "neutral"}
            />

            <MetricTile
              icon={<CalendarClock className="size-5" />}
              title="Expiry"
              value={
                expiryState.isExpired
                  ? "Expired"
                  : expiryState.isExpiringSoon
                    ? "Expiring soon"
                    : medication.expiryDate ?? "No expiry"
              }
              description={
                expiryState.daysUntilExpiry === null
                  ? "No timeline available"
                  : expiryState.daysUntilExpiry < 0
                    ? `${Math.abs(expiryState.daysUntilExpiry)} days past expiry`
                    : `${expiryState.daysUntilExpiry} days remaining`
              }
              tone={
                expiryState.isExpired
                  ? "danger"
                  : expiryState.isExpiringSoon
                    ? "warning"
                    : "neutral"
              }
            />

            <MetricTile
              icon={<ShieldAlert className="size-5" />}
              title="Safety flags"
              value={String(safetyBadges.length)}
              description={
                safetyBadges.length > 0
                  ? "Flags require review"
                  : "No safety flags"
              }
              tone={safetyBadges.length > 0 ? "warning" : "neutral"}
            />

            <MetricTile
              icon={<MapPin className="size-5" />}
              title="Storage"
              value={formatLabel(medication.storageRequirement)}
              description={medication.storageLocation ?? "No location set"}
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-5">
              <EnterpriseSection
                icon={<ClipboardList className="size-5" />}
                title="Clinical profile"
                description="Medication identity, dosing context, schedule, and administration details."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailItem label="Strength">
                    {medication.strength ?? "Not set"}
                  </DetailItem>

                  <DetailItem label="Dosage">
                    {medication.dosage ?? "Not set"}
                  </DetailItem>

                  <DetailItem label="Form">
                    {medication.form ?? "Not set"}
                  </DetailItem>

                  <DetailItem label="Route">
                    {medication.route ?? "Not set"}
                  </DetailItem>

                  <DetailItem label="Drug schedule">
                    <Badge variant="outline" className="rounded-full">
                      {formatLabel(medication.drugSchedule)}
                    </Badge>
                  </DetailItem>

                  <DetailItem label="DIN">
                    <span className="font-mono">
                      {medication.din ?? "No DIN"}
                    </span>
                  </DetailItem>
                </div>
              </EnterpriseSection>

              <EnterpriseSection
                icon={<Package className="size-5" />}
                title="Inventory and storage"
                description="Operational inventory, reorder threshold, lot tracking, and storage location."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailItem label="Stock quantity">
                    {medication.stockQuantity}{" "}
                    {formatLabel(medication.unitOfMeasure)}
                  </DetailItem>

                  <DetailItem label="Reorder level">
                    {medication.reorderLevel ?? "Not set"}
                  </DetailItem>

                  <DetailItem label="Storage requirement">
                    {formatLabel(medication.storageRequirement)}
                  </DetailItem>

                  <DetailItem label="Storage location">
                    {medication.storageLocation ?? "No location set"}
                  </DetailItem>

                  <DetailItem label="Lot number">
                    {medication.lotNumber ?? "Not set"}
                  </DetailItem>

                  <DetailItem label="Expiry date">
                    {expiryState.isExpired ? (
                      <Badge variant="destructive" className="rounded-full">
                        Expired {expiryState.label}
                      </Badge>
                    ) : expiryState.isExpiringSoon ? (
                      <Badge variant="secondary" className="rounded-full">
                        Expiring {expiryState.label}
                      </Badge>
                    ) : (
                      medication.expiryDate ?? "No expiry"
                    )}
                  </DetailItem>
                </div>
              </EnterpriseSection>
            </section>

            <section className="space-y-5">
              <EnterpriseSection
                icon={<ShieldAlert className="size-5" />}
                title="Safety controls"
                description="Clinical safety, counselling, controlled substance, and cold-chain indicators."
              >
                <div className="flex flex-wrap gap-2">
                  {safetyBadges.length > 0 ? (
                    safetyBadges.map((badge) => (
                      <Badge
                        key={badge.label}
                        variant={badge.variant}
                        className="gap-1 rounded-full"
                      >
                        {badge.icon}
                        {badge.label}
                      </Badge>
                    ))
                  ) : (
                    <Badge
                      variant="outline"
                      className="gap-1 rounded-full text-emerald-600"
                    >
                      <CheckCircle2 className="size-3" />
                      Standard medication
                    </Badge>
                  )}
                </div>

                <div className="mt-4 grid gap-2">
                  <BooleanDetail
                    label="Requires counselling"
                    value={medication.requiresCounselling}
                  />
                  <BooleanDetail
                    label="Requires refrigeration"
                    value={medication.requiresRefrigeration}
                  />
                  <BooleanDetail
                    label="Controlled substance"
                    value={medication.controlledSubstance}
                  />
                  <BooleanDetail
                    label="High-alert medication"
                    value={medication.isHighAlert}
                  />
                  <BooleanDetail
                    label="Look-alike / sound-alike"
                    value={medication.isLookAlikeSoundAlike}
                  />
                </div>
              </EnterpriseSection>

              <EnterpriseSection
                icon={<Building2 className="size-5" />}
                title="Product identity"
                description="Manufacturer, brand, and generic metadata."
              >
                <div className="space-y-4">
                  <DetailItem label="Brand name">
                    {medication.brandName ?? "Not set"}
                  </DetailItem>

                  <DetailItem label="Generic name">
                    {medication.genericName ?? "Not set"}
                  </DetailItem>

                  <DetailItem label="Manufacturer">
                    {medication.manufacturer ?? "Not set"}
                  </DetailItem>
                </div>
              </EnterpriseSection>
            </section>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <EnterpriseSection
              icon={<FileText className="size-5" />}
              title="Pharmacist notes"
              description="Internal operational notes for pharmacy staff."
            >
              <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {medication.pharmacistNotes || "No pharmacist notes added."}
              </p>
            </EnterpriseSection>

            <EnterpriseSection
              icon={<FileText className="size-5" />}
              title="Description"
              description="General medication description and reference context."
            >
              <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {medication.description || "No medication description added."}
              </p>
            </EnterpriseSection>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function HeaderChip({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1">
      {icon}
      <span className="max-w-[220px] truncate">{label}</span>
    </div>
  )
}

type MetricTone = "neutral" | "warning" | "danger"

function MetricTile({
  icon,
  title,
  value,
  description,
  tone = "neutral",
}: {
  icon: ReactNode
  title: string
  value: string
  description: string
  tone?: MetricTone
}) {
  const toneClass =
    tone === "danger"
      ? "bg-destructive/10 text-destructive"
      : tone === "warning"
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
        : "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300"

  return (
    <div className="rounded-2xl border bg-background p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 break-words text-lg font-semibold tracking-tight">
            {value}
          </p>
          <p className="mt-1 break-words text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <div className={`rounded-xl p-2 ${toneClass}`}>{icon}</div>
      </div>
    </div>
  )
}

function EnterpriseSection({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border bg-slate-50/70 p-4 shadow-sm dark:bg-slate-950/40">
      <div className="mb-4 flex gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-background text-muted-foreground">
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  )
}

function DetailItem({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border bg-background px-3 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-1 break-words text-sm font-medium">{children}</div>
    </div>
  )
}

function BooleanDetail({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border bg-background px-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>

      {value ? (
        <Badge variant="secondary" className="rounded-full">
          Yes
        </Badge>
      ) : (
        <Badge variant="outline" className="rounded-full">
          No
        </Badge>
      )}
    </div>
  )
}