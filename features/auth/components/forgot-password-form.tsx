"use client"

import Link from "next/link"
import { useEffect, useId, useMemo, useState } from "react"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  Pill,
  ShieldCheck,
} from "lucide-react"
import { z } from "zod"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { APP_CONFIG, APP_LIMITS, ROUTES } from "@/constants"


const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required.")
    .email("Enter a valid email address.")
    .max(254, "Email address is too long."),
  companyWebsite: z.string().max(0).optional(),
})

type ForgotPasswordStatus = "idle" | "submitting" | "success" | "error"

function getResetRedirectUrl() {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "")

  const resetPath = ROUTES.AUTH.RESET_PASSWORD.startsWith("/")
    ? ROUTES.AUTH.RESET_PASSWORD
    : `/${ROUTES.AUTH.RESET_PASSWORD}`

  return `${appUrl}${resetPath}`
}

function getPublicErrorMessage(message?: string) {
  if (!message) {
    return "We could not send a reset link right now. Please try again."
  }

  const normalizedMessage = message.toLowerCase()

  if (
    normalizedMessage.includes("domain is not verified") ||
    normalizedMessage.includes("resend") ||
    normalizedMessage.includes("api key")
  ) {
    return "Email delivery is not fully configured yet. Please check your email provider settings."
  }

  if (normalizedMessage.includes("rate")) {
    return "Too many reset attempts. Please wait a moment before trying again."
  }

  return "We could not send a reset link right now. Please try again."
}

export function ForgotPasswordForm() {
  const emailInputId = useId()
  const emailErrorId = useId()
  const formMessageId = useId()

  const [email, setEmail] = useState("")
  const [companyWebsite, setCompanyWebsite] = useState("")
  const [fieldError, setFieldError] = useState("")
  const [formError, setFormError] = useState("")
  const [submittedEmail, setSubmittedEmail] = useState("")
  const [status, setStatus] = useState<ForgotPasswordStatus>("idle")
  const [cooldown, setCooldown] = useState(0)

  const isSubmitting = status === "submitting"
  const isSubmitted = status === "success"

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email])

  useEffect(() => {
    if (cooldown <= 0) return

    const timer = window.setInterval(() => {
      setCooldown((current) => Math.max(0, current - 1))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [cooldown])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting || cooldown > 0) return

    setFieldError("")
    setFormError("")

    const parsed = forgotPasswordSchema.safeParse({
      email: normalizedEmail,
      companyWebsite,
    })

    if (!parsed.success) {
      const issue = parsed.error.issues[0]

      if (issue?.path.includes("companyWebsite")) {
        // Honeypot triggered. Do not reveal anything.
        setSubmittedEmail(normalizedEmail || "your email")
        setStatus("success")
        return
      }

      setFieldError(issue?.message || "Enter a valid email address.")
      setStatus("error")
      return
    }

    setStatus("submitting")

    try {
      const { error } = await authClient.requestPasswordReset({
        email: parsed.data.email,
        redirectTo: getResetRedirectUrl(),
      })

      if (error) {
        setFormError(getPublicErrorMessage(error.message))
        setStatus("error")
        setCooldown(APP_LIMITS.passwordResetCooldownSeconds)
        return
      }

      setSubmittedEmail(parsed.data.email)
      setStatus("success")
      setCooldown(APP_LIMITS.passwordResetCooldownSeconds)
    } catch (error) {
      console.error("[forgot_password.request_failed]", {
        email: parsed.data.email,
        error,
      })

      setFormError("Something went wrong while sending the reset link.")
      setStatus("error")
      setCooldown(APP_LIMITS.passwordResetCooldownSeconds)
    }
  }

  function handleEmailChange(value: string) {
    setEmail(value)
    setFieldError("")
    setFormError("")

    if (status === "error") {
      setStatus("idle")
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.08),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.10),transparent_30%)]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="flex items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-white"
            aria-label={`${APP_CONFIG.name} home`}
          >
            <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
              <Pill className="size-5" aria-hidden="true" />
            </div>

            <div>
              <p className="text-lg font-semibold tracking-tight">
                {APP_CONFIG.name}
              </p>
              <p className="text-sm text-slate-500">{APP_CONFIG.tagline}</p>
            </div>
          </Link>
        </div>

        <Card className="rounded-3xl border-slate-200 bg-white/95 shadow-xl shadow-slate-200/70 backdrop-blur">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
              {isSubmitted ? (
                <CheckCircle2 className="size-5" aria-hidden="true" />
              ) : (
                <Mail className="size-5" aria-hidden="true" />
              )}
            </div>

            <CardTitle className="text-2xl tracking-tight">
              {isSubmitted ? "Check your email" : "Forgot password?"}
            </CardTitle>

            <CardDescription className="leading-6">
              {isSubmitted
                ? "If an account exists for that email, a secure reset link has been sent."
                : "Enter your email address and we will send a secure password reset link."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div id={formMessageId} aria-live="polite">
              {isSubmitted ? (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
                    <div className="mb-2 flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="size-4" aria-hidden="true" />
                      Reset link requested
                    </div>

                    <p>
                      We sent instructions to{" "}
                      <span className="font-semibold">
                        {submittedEmail || "your email"}
                      </span>
                      . The link expires soon for your security.
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                    <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
                      <ShieldCheck className="size-4" aria-hidden="true" />
                      Security note
                    </div>

                    <p>
                      For privacy, we show the same confirmation even if the
                      email is not registered.
                    </p>
                  </div>

                  <Link
                   href={ROUTES.AUTH.LOGIN}
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                  >
                    Back to login
                  </Link>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                  {formError ? (
                    <div
                      role="alert"
                      className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
                    >
                      <AlertCircle
                        className="mt-0.5 size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <p>{formError}</p>
                    </div>
                  ) : null}

                  <input
                    type="text"
                    name="companyWebsite"
                    value={companyWebsite}
                    onChange={(event) =>
                      setCompanyWebsite(event.target.value)
                    }
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div className="space-y-2">
                    <label
                      htmlFor={emailInputId}
                      className="text-sm font-medium text-slate-700"
                    >
                      Email address
                    </label>

                    <div className="relative">
                      <Mail
                        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                        aria-hidden="true"
                      />

                      <Input
                        id={emailInputId}
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        placeholder="you@example.com"
                        value={email}
                        disabled={isSubmitting}
                        aria-invalid={Boolean(fieldError)}
                        aria-describedby={
                          fieldError ? emailErrorId : formMessageId
                        }
                        onChange={(event) =>
                          handleEmailChange(event.target.value)
                        }
                        className="h-11 rounded-xl pl-10"
                      />
                    </div>

                    {fieldError ? (
                      <p id={emailErrorId} className="text-sm text-red-600">
                        {fieldError}
                      </p>
                    ) : (
                      <p className="text-xs leading-5 text-slate-500">
                        Use the email associated with your {APP_CONFIG.name} account.
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || cooldown > 0}
                    className="h-11 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2
                          className="mr-2 size-4 animate-spin"
                          aria-hidden="true"
                        />
                        Sending reset link...
                      </>
                    ) : cooldown > 0 ? (
                      `Try again in ${cooldown}s`
                    ) : (
                      "Send reset link"
                    )}
                  </Button>

                  <Link
                    href={ROUTES.AUTH.LOGIN}
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                  >
                    <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
                    Back to login
                  </Link>
                </form>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          Password reset links are time-limited and should never be shared.
        </p>
      </div>
    </main>
  )
}