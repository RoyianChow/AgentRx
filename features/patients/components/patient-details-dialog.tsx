"use client"

import { useId, useMemo, useState, useTransition } from "react"
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react"

import {
  getPatientDetailsAction,
  type PatientSecureDetails,
} from "@/features/patients/actions/get-patient-details-action"
import { PatientDetailsContent } from "@/features/patients/components/patient-details-content"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type PatientDetailsDialogProps = {
  patientId: string
  patientName: string
  currentUserEmail?: string
}

type UnlockState = "locked" | "verifying" | "unlocked" | "error"

const MAX_UNLOCK_ATTEMPTS = 5

function getSafePatientLabel(name: string) {
  return name.trim() || "this patient"
}

export function PatientDetailsDialog({
  patientId,
  patientName,
}: PatientDetailsDialogProps) {
  const passwordInputId = useId()
  const errorMessageId = useId()
  const descriptionId = useId()

  const safePatientName = useMemo(
    () => getSafePatientLabel(patientName),
    [patientName]
  )

  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [unlockState, setUnlockState] = useState<UnlockState>("locked")
  const [patient, setPatient] = useState<PatientSecureDetails | null>(null)
  const [error, setError] = useState("")
  const [attemptCount, setAttemptCount] = useState(0)
  const [isPending, startTransition] = useTransition()

  const isUnlocked = unlockState === "unlocked"
  const isVerifying = isPending || unlockState === "verifying"
  const hasTooManyAttempts = attemptCount >= MAX_UNLOCK_ATTEMPTS

  function resetDialogState() {
    setPassword("")
    setShowPassword(false)
    setUnlockState("locked")
    setPatient(null)
    setError("")
    setAttemptCount(0)
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)

    if (!nextOpen) {
      resetDialogState()
    }
  }

  function handlePasswordChange(value: string) {
    setPassword(value)
    setError("")

    if (unlockState === "error") {
      setUnlockState("locked")
    }
  }

  async function handleUnlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isVerifying) return

    if (hasTooManyAttempts) {
      setError(
        "Too many failed attempts. Close this window and try again later."
      )
      return
    }

    const trimmedPassword = password.trim()

    if (!trimmedPassword) {
      setUnlockState("error")
      setError("Enter the patient record access password.")
      return
    }

    setError("")
    setUnlockState("verifying")

    startTransition(async () => {
      try {
        const result = await getPatientDetailsAction({
          patientId,
          accessPassword: trimmedPassword,
        })

        if (!result.success) {
          setAttemptCount((current) => current + 1)
          setUnlockState("error")
          setError(result.message)
          return
        }

        setPatient(result.patient)
        setPassword("")
        setShowPassword(false)
        setUnlockState("unlocked")
      } catch (error) {
        console.error("[patient_details_dialog.unlock_failed]", {
          patientId,
          error,
        })

        setAttemptCount((current) => current + 1)
        setUnlockState("error")
        setError("Unable to unlock patient record. Please try again.")
      }
    })
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="rounded-xl"
        onClick={() => setOpen(true)}
      >
        Open
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="clean-scrollbar max-h-[92vh] overflow-hidden rounded-3xl border-slate-200 p-0 shadow-2xl sm:max-w-5xl"
          aria-describedby={descriptionId}
        >
          <div className="border-b bg-gradient-to-br from-slate-150 via-slate-100 to-emerald-150 px-6 py-5 text-black">
            <DialogHeader>
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  {isUnlocked ? (
                    <UserRound className="size-5" aria-hidden="true" />
                  ) : (
                    <LockKeyhole className="size-5" aria-hidden="true" />
                  )}
                </div>

                <div>
                  <DialogTitle className="text-2xl tracking-tight text-white">
                    {isUnlocked ? "Patient Profile" : "Password Required"}
                  </DialogTitle>

                  <DialogDescription
                    id={descriptionId}
                    className="mt-1 max-w-2xl text-sm leading-6 text-slate-300"
                  >
                    {isUnlocked
                      ? "Sensitive patient intake information is displayed below for the current session."
                      : "Enter the shared patient record access password before viewing protected patient information."}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="pharma-scrollbar max-h-[calc(92vh-224px)] overflow-y-auto px-6 pb-8 pt-6">
            {!isUnlocked ? (
              <div className="mx-auto max-w-xl space-y-5">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                  <div className="mb-2 flex items-center gap-2 font-semibold">
                    <ShieldCheck className="size-4" aria-hidden="true" />
                    Protected patient record
                  </div>

                  <p>
                    You are opening the full patient profile for{" "}
                    <span className="font-semibold">{safePatientName}</span>.
                    This may include health card details, allergies, medication
                    history, care team information, and internal pharmacy notes.
                  </p>
                </div>

                {error ? (
                  <div
                    id={errorMessageId}
                    role="alert"
                    aria-live="polite"
                    className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
                  >
                    <AlertCircle
                      className="mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <p>{error}</p>
                  </div>
                ) : null}

                <form onSubmit={handleUnlock} className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <label
                        htmlFor={passwordInputId}
                        className="text-sm font-medium text-slate-700"
                      >
                        Patient record access password
                      </label>

                      <span className="text-xs text-slate-400">
                        Attempts: {attemptCount}/{MAX_UNLOCK_ATTEMPTS}
                      </span>
                    </div>

                    <div className="relative">
                      <LockKeyhole
                        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                        aria-hidden="true"
                      />

                      <Input
                        id={passwordInputId}
                        type={showPassword ? "text" : "password"}
                        value={password}
                        disabled={isVerifying || hasTooManyAttempts}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        placeholder="Enter access password"
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? errorMessageId : undefined}
                        onChange={(event) =>
                          handlePasswordChange(event.target.value)
                        }
                        className="h-11 rounded-xl pl-10 pr-10"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        disabled={isVerifying || hasTooManyAttempts}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md text-slate-400 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" aria-hidden="true" />
                        ) : (
                          <Eye className="size-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>

                    <p className="text-xs leading-5 text-slate-500">
                      Access is verified on the server. The password is never
                      displayed or logged.
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-slate-50 p-4 text-xs leading-5 text-slate-500">
                    Patient data should only be accessed by authorized pharmacy
                    staff for workflow, care coordination, prescription review,
                    and documentation purposes.
                  </div>

                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => setOpen(false)}
                      disabled={isVerifying}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      className="rounded-xl"
                      disabled={isVerifying || hasTooManyAttempts}
                    >
                      {isVerifying ? (
                        <>
                          <Loader2
                            className="mr-2 size-4 animate-spin"
                            aria-hidden="true"
                          />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <LockKeyhole
                            className="mr-2 size-4"
                            aria-hidden="true"
                          />
                          Unlock Record
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            ) : patient ? (
              <div className="pr-1">
                <PatientDetailsContent patient={patient} />
              </div>
            ) : null}
          </div>

          <div className="border-t bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-4 text-white">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                  <ShieldCheck className="size-4 text-emerald-200" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    {isUnlocked
                      ? "Record access active"
                      : "Protected healthcare workspace"}
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-slate-300">
                    {isUnlocked
                      ? "Close this window to clear the unlocked patient record from this view."
                      : "Patient records require authorization before sensitive details are displayed."}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-white/15 bg-white/10 text-white hover:bg-white hover:text-slate-950"
                onClick={() => setOpen(false)}
                disabled={isVerifying}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}