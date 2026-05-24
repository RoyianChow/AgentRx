"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { AlertCircle, CheckCircle2, Loader2, Plus, ShieldCheck } from "lucide-react"

import {
  createPatientAction,
  type CreatePatientActionState,
} from "@/features/patients/actions/create-patient-action"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

const initialState: CreatePatientActionState = {
  success: false,
  message: "",
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null

  return <p className="text-sm text-red-600">{errors[0]}</p>
}

export function CreatePatientDialog() {
  const formRef = useRef<HTMLFormElement>(null)
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(
    createPatientAction,
    initialState
  )

  useEffect(() => {
    if (!state.success) return

    formRef.current?.reset()

    const timer = window.setTimeout(() => {
      setOpen(false)
    }, 900)

    return () => window.clearTimeout(timer)
  }, [state.success])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">
          <Plus className="mr-2 size-4" />
          Add Patient
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-3xl sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">New Patient Intake</DialogTitle>
          <DialogDescription>
            Collect the core patient profile information needed for pharmacy
            intake, prescription workflows, coverage checks, and pharmacist
            review.
          </DialogDescription>
        </DialogHeader>

        {state.message ? (
          <div
            role="alert"
            className={`flex gap-3 rounded-2xl border p-4 text-sm ${
              state.success
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {state.success ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
            )}
            <p>{state.message}</p>
          </div>
        ) : null}

        <form ref={formRef} action={formAction} className="space-y-8">
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-950">
                Patient Identity
              </h3>
              <p className="text-sm text-slate-500">
                Basic information used to identify the patient profile.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full name *</label>
                <Input name="fullName" placeholder="Amina Rahman" required />
                <FieldError errors={state.fieldErrors?.fullName} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date of birth</label>
                <Input name="dateOfBirth" type="date" />
                <FieldError errors={state.fieldErrors?.dateOfBirth} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input name="phone" placeholder="416-555-0123" />
                <FieldError errors={state.fieldErrors?.phone} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input name="email" type="email" placeholder="patient@example.com" />
                <FieldError errors={state.fieldErrors?.email} />
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-950">
                Address
              </h3>
              <p className="text-sm text-slate-500">
                Useful for patient records, delivery workflows, and identity
                confirmation.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Address line 1</label>
                <Input name="addressLine1" placeholder="123 Example Street" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Address line 2</label>
                <Input name="addressLine2" placeholder="Unit 400" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input name="city" placeholder="Toronto" />
              </div>

              <div className="grid grid-cols-[1fr_1.5fr] gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Province</label>
                  <Input name="province" defaultValue="ON" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Postal code</label>
                  <Input name="postalCode" placeholder="M5V 0A0" />
                </div>
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-950">
                Coverage and Billing
              </h3>
              <p className="text-sm text-slate-500">
                For Ontario workflows, health card and plan information may be
                needed for coverage checks.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Ontario health card number
                </label>
                <Input name="healthCardNumber" placeholder="0000-000-000" />
                <p className="text-xs text-slate-500">
                  Use synthetic values only during development.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Version code</label>
                <Input name="healthCardVersion" placeholder="AA" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Insurance provider
                </label>
                <Input name="insuranceProvider" placeholder="Ontario Drug Benefit / Private plan" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Drug plan ID</label>
                <Input name="drugPlanId" placeholder="Plan/member/group ID" />
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-950">
                Clinical Intake Notes
              </h3>
              <p className="text-sm text-slate-500">
                These fields support pharmacist review and medication safety
                checks. They should not replace professional judgment.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Allergies / sensitivities
                </label>
                <Textarea
                  name="allergies"
                  placeholder="Penicillin allergy, lactose sensitivity, NKDA, etc."
                  className="min-h-28"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Medical conditions
                </label>
                <Textarea
                  name="medicalConditions"
                  placeholder="Diabetes, hypertension, pregnancy, kidney disease, etc."
                  className="min-h-28"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">
                  Current medications
                </label>
                <Textarea
                  name="currentMedications"
                  placeholder="List current prescriptions, OTC products, vitamins, supplements, and relevant medication history."
                  className="min-h-28"
                />
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-950">
                Care Team and Emergency Contact
              </h3>
              <p className="text-sm text-slate-500">
                Useful for clarifications, continuity of care, and patient
                support workflows.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Primary physician / prescriber
                </label>
                <Input name="primaryPhysicianName" placeholder="Dr. Maya Thompson" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Physician / prescriber phone
                </label>
                <Input name="primaryPhysicianPhone" placeholder="416-555-0198" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Emergency contact name
                </label>
                <Input name="emergencyContactName" placeholder="Family member / caregiver" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Emergency contact phone
                </label>
                <Input name="emergencyContactPhone" placeholder="647-555-0129" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">
                  Emergency contact relationship
                </label>
                <Input name="emergencyContactRelationship" placeholder="Parent, spouse, caregiver, etc." />
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-950">
                Communication and Consent
              </h3>
              <p className="text-sm text-slate-500">
                Record how the patient prefers to be contacted and confirm
                consent before collecting health information.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Preferred contact method
                </label>

                <select
                  name="preferredContactMethod"
                  defaultValue="PHONE"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="PHONE">Phone</option>
                  <option value="EMAIL">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="NONE">Do not contact</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Preferred pharmacy
                </label>
                <Input name="preferredPharmacy" placeholder="AgentShefa Demo Pharmacy" />
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border bg-slate-50 p-4">
              <label className="flex gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="consentToCollectHealthInfo"
                  className="mt-1 size-4 rounded border-slate-300"
                  required
                />
                <span>
                  Patient consent obtained to collect and use personal health
                  information for pharmacy care and prescription workflow
                  purposes. *
                </span>
              </label>

              <FieldError errors={state.fieldErrors?.consentToCollectHealthInfo} />

              <label className="flex gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="consentToContact"
                  className="mt-1 size-4 rounded border-slate-300"
                />
                <span>
                  Patient consent obtained for pharmacy communications related
                  to prescriptions, pickup status, and care coordination.
                </span>
              </label>

              <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                <p>
                  For this project stage, use synthetic data only. Real patient
                  data requires a proper privacy, security, and compliance
                  review.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-2">
            <label className="text-sm font-medium">Internal notes</label>
            <Textarea
              name="notes"
              placeholder="Additional pharmacy intake notes, accessibility needs, delivery preferences, caregiver instructions, etc."
              className="min-h-28"
            />
          </section>

          <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white py-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" className="rounded-xl" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating patient...
                </>
              ) : (
                <>
                  <Plus className="mr-2 size-4" />
                  Create Patient
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}