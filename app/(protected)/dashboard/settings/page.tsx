"use client"

import { useState, type ElementType } from "react"
import {
  AlertTriangle,
  Bell,
  Bot,
  Building2,
  CheckCircle2,
  Database,
  KeyRound,
  LockKeyhole,
  Mail,
  Pill,
  RotateCcw,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  UserCog,
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type SettingToggleKey =
  | "medicationPasswordRequired"
  | "lowStockAlerts"
  | "expiryAlerts"
  | "controlledSubstanceLock"
  | "aiMedicationReview"
  | "emailNotifications"
  | "auditLogging"
  | "sessionProtection"

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<SettingToggleKey, boolean>>({
    medicationPasswordRequired: true,
    lowStockAlerts: true,
    expiryAlerts: true,
    controlledSubstanceLock: true,
    aiMedicationReview: true,
    emailNotifications: false,
    auditLogging: true,
    sessionProtection: true,
  })

  function updateSetting(key: SettingToggleKey) {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

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
                  <SlidersHorizontal className="mr-1 size-3" />
                  AgentRx Settings
                </Badge>

                <Badge
                  variant="outline"
                  className="rounded-full border-emerald-300 bg-emerald-50 text-emerald-950"
                >
                  <CheckCircle2 className="mr-1 size-3" />
                  System configured
                </Badge>
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Settings
                </h1>
                <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-700">
                  Configure pharmacy workspace preferences, medication safety
                  controls, password protection, notifications, and AI-assisted
                  review settings.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="rounded-xl border-slate-300 bg-white text-slate-950 hover:bg-slate-100 hover:text-slate-950"
              >
                <RotateCcw className="mr-2 size-4" />
                Reset
              </Button>

              <Button className="rounded-xl bg-slate-950 text-white hover:bg-slate-800">
                <Save className="mr-2 size-4" />
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SettingsMetric
          title="Security"
          value="Protected"
          description="Password required for medication changes"
          icon={LockKeyhole}
        />

        <SettingsMetric
          title="Inventory alerts"
          value="Enabled"
          description="Low stock and expiry monitoring"
          icon={Bell}
        />

        <SettingsMetric
          title="AI review"
          value="Active"
          description="Medication safety support enabled"
          icon={Bot}
        />

        <SettingsMetric
          title="Audit logging"
          value="On"
          description="Operational activity tracking"
          icon={Database}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-3xl border-slate-200 bg-white text-slate-950 shadow-sm">
          <CardHeader className="border-b border-slate-200 bg-slate-50/80">
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950">
              <Building2 className="size-5 text-slate-800" />
              Pharmacy Workspace
            </CardTitle>
            <CardDescription className="text-sm font-medium text-slate-700">
              Configure the default workspace identity used across the AgentRx
              dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FieldGroup label="Pharmacy name">
                <Input
                  defaultValue="AgentRx Pharmacy"
                  className="border-slate-300 bg-white text-slate-950 placeholder:text-slate-500 focus-visible:border-slate-950 focus-visible:ring-slate-950/20"
                />
              </FieldGroup>

              <FieldGroup label="Workspace type">
                <Input
                  defaultValue="Clinical Operations"
                  className="border-slate-300 bg-white text-slate-950 placeholder:text-slate-500 focus-visible:border-slate-950 focus-visible:ring-slate-950/20"
                />
              </FieldGroup>

              <FieldGroup label="Primary email">
                <Input
                  defaultValue="admin@agentrx.com"
                  className="border-slate-300 bg-white text-slate-950 placeholder:text-slate-500 focus-visible:border-slate-950 focus-visible:ring-slate-950/20"
                />
              </FieldGroup>

              <FieldGroup label="Location">
                <Input
                  defaultValue="Toronto, ON"
                  className="border-slate-300 bg-white text-slate-950 placeholder:text-slate-500 focus-visible:border-slate-950 focus-visible:ring-slate-950/20"
                />
              </FieldGroup>
            </div>

            <FieldGroup label="Internal workspace note">
              <Textarea
                defaultValue="Use this workspace for medication inventory, safety flag review, pharmacist notes, and prescription workflow support."
                rows={4}
                className="border-slate-300 bg-white text-slate-950 placeholder:text-slate-500 focus-visible:border-slate-950 focus-visible:ring-slate-950/20"
              />
            </FieldGroup>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 bg-white text-slate-950 shadow-sm">
          <CardHeader className="border-b border-slate-200 bg-slate-50/80">
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950">
              <ShieldCheck className="size-5 text-slate-800" />
              Medication Safety Controls
            </CardTitle>
            <CardDescription className="text-sm font-medium text-slate-700">
              Control how medication records are protected, reviewed, and
              monitored.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 p-6">
            <SettingsToggle
              title="Require password for medication changes"
              description="Users must enter the medication admin password before creating, updating, or deleting records."
              icon={KeyRound}
              checked={settings.medicationPasswordRequired}
              onCheckedChange={() =>
                updateSetting("medicationPasswordRequired")
              }
            />

            <SettingsToggle
              title="Controlled substance protection"
              description="Add extra confirmation for controlled or high-alert medication workflows."
              icon={LockKeyhole}
              checked={settings.controlledSubstanceLock}
              onCheckedChange={() => updateSetting("controlledSubstanceLock")}
            />

            <SettingsToggle
              title="Low stock alerts"
              description="Flag medications when stock quantity reaches or falls below the reorder level."
              icon={AlertTriangle}
              checked={settings.lowStockAlerts}
              onCheckedChange={() => updateSetting("lowStockAlerts")}
            />

            <SettingsToggle
              title="Expiry monitoring"
              description="Highlight medication records expiring within the next 90 days."
              icon={Pill}
              checked={settings.expiryAlerts}
              onCheckedChange={() => updateSetting("expiryAlerts")}
            />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="rounded-3xl border-slate-200 bg-white text-slate-950 shadow-sm">
          <CardHeader className="border-b border-slate-200 bg-slate-50/80">
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950">
              <Bot className="size-5 text-slate-800" />
              AI Assistance
            </CardTitle>
            <CardDescription className="text-sm font-medium text-slate-700">
              Configure AI-assisted medication and pharmacist support.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 p-6">
            <SettingsToggle
              title="AI medication review"
              description="Enable AI-supported review for medication context, safety flags, and pharmacist notes."
              icon={Bot}
              checked={settings.aiMedicationReview}
              onCheckedChange={() => updateSetting("aiMedicationReview")}
            />

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-950">
                AI safety mode
              </p>
              <p className="mt-1 text-sm font-medium leading-5 text-slate-700">
                AI suggestions should be treated as support only. Pharmacist
                review remains required for clinical decisions.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 bg-white text-slate-950 shadow-sm">
          <CardHeader className="border-b border-slate-200 bg-slate-50/80">
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950">
              <Bell className="size-5 text-slate-800" />
              Notifications
            </CardTitle>
            <CardDescription className="text-sm font-medium text-slate-700">
              Manage operational and account notifications.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 p-6">
            <SettingsToggle
              title="Email notifications"
              description="Send alerts for low stock, expiring medications, and safety flags."
              icon={Mail}
              checked={settings.emailNotifications}
              onCheckedChange={() => updateSetting("emailNotifications")}
            />

            <NotificationPreview
              title="Low stock alert"
              description="Triggered when medication stock reaches reorder level."
            />

            <NotificationPreview
              title="Expiry alert"
              description="Triggered when a medication expires within 90 days."
            />
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 bg-white text-slate-950 shadow-sm">
          <CardHeader className="border-b border-slate-200 bg-slate-50/80">
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950">
              <UserCog className="size-5 text-slate-800" />
              Access & Security
            </CardTitle>
            <CardDescription className="text-sm font-medium text-slate-700">
              Protect accounts and track sensitive medication actions.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 p-6">
            <SettingsToggle
              title="Audit logging"
              description="Track medication create, update, delete, and admin activity."
              icon={Database}
              checked={settings.auditLogging}
              onCheckedChange={() => updateSetting("auditLogging")}
            />

            <SettingsToggle
              title="Session protection"
              description="Require secure authenticated sessions for dashboard access."
              icon={ShieldCheck}
              checked={settings.sessionProtection}
              onCheckedChange={() => updateSetting("sessionProtection")}
            />

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-950">
                Medication admin password
              </p>
              <p className="mt-1 text-sm font-medium leading-5 text-slate-700">
                Stored server-side through environment variables. Never expose
                this password in client-side code.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

type SettingsMetricProps = {
  title: string
  value: string
  description: string
  icon: ElementType
}

function SettingsMetric({
  title,
  value,
  description,
  icon: Icon,
}: SettingsMetricProps) {
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

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900">
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  )
}

function FieldGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-bold text-slate-950">{label}</Label>
      {children}
    </div>
  )
}

type SettingsToggleProps = {
  title: string
  description: string
  icon: ElementType
  checked: boolean
  onCheckedChange: () => void
}

function SettingsToggle({
  title,
  description,
  icon: Icon,
  checked,
  onCheckedChange,
}: SettingsToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex gap-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900">
          <Icon className="size-4" />
        </div>

        <div>
          <p className="text-sm font-bold text-slate-950">{title}</p>
          <p className="mt-1 max-w-xl text-sm font-medium leading-5 text-slate-700">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onCheckedChange}
        className={
          checked
            ? "relative h-6 w-11 shrink-0 rounded-full bg-slate-950 transition"
            : "relative h-6 w-11 shrink-0 rounded-full bg-slate-300 transition"
        }
      >
        <span
          className={
            checked
              ? "absolute left-6 top-1 size-4 rounded-full bg-white transition"
              : "absolute left-1 top-1 size-4 rounded-full bg-white transition"
          }
        />
      </button>
    </div>
  )
}

function NotificationPreview({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-2 text-slate-900">
          <Bell className="size-4" />
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