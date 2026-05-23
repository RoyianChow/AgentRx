"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useMemo, useState } from "react"
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  Pill,
  ShieldCheck,
} from "lucide-react"

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

type LoginFormState = {
  email: string
  password: string
  rememberMe: boolean
}

type LoginErrors = Partial<Record<keyof LoginFormState | "root", string>>

const DEFAULT_REDIRECT_PATH = "/dashboard"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function sanitizeRedirectPath(value: string | null) {
  if (!value) return DEFAULT_REDIRECT_PATH

  if (!value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_REDIRECT_PATH
  }

  return value
}

function LoginFormInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const redirectTo = useMemo(() => {
    return sanitizeRedirectPath(searchParams.get("redirectTo"))
  }, [searchParams])

  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
    rememberMe: true,
  })

  const [errors, setErrors] = useState<LoginErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function updateField<TField extends keyof LoginFormState>(
    field: TField,
    value: LoginFormState[TField]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    setErrors((current) => ({
      ...current,
      [field]: undefined,
      root: undefined,
    }))
  }

  function validateForm() {
    const nextErrors: LoginErrors = {}
    const email = form.email.trim().toLowerCase()

    if (!email) {
      nextErrors.email = "Email is required."
    } else if (!isValidEmail(email)) {
      nextErrors.email = "Enter a valid email address."
    }

    if (!form.password) {
      nextErrors.password = "Password is required."
    } else if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters."
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) return
    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const { error } = await authClient.signIn.email({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        rememberMe: form.rememberMe,
        callbackURL: redirectTo,
      })

      if (error) {
        setErrors({
          root:
            error.message ||
            "We could not sign you in. Check your email and password.",
        })
        return
      }

      router.replace(redirectTo)
      router.refresh()
    } catch {
      setErrors({
        root: "Something went wrong while signing in. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden border-r border-white/10 bg-slate-950 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.16),transparent_35%)]" />

          <div className="relative flex h-full flex-col justify-between p-10">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-2xl">
                <Pill className="size-5" />
              </div>

              <div>
                <p className="text-lg font-semibold tracking-tight">
                  AgentShefa
                </p>
                <p className="text-sm text-slate-400">
                  AI pharmacy operating system
                </p>
              </div>
            </div>

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                <ShieldCheck className="size-4" />
                Secure pharmacist-reviewed workflow
              </div>

              <h1 className="text-5xl font-semibold tracking-tight">
                Medication workflows with safer AI-assisted review.
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
                Manage patients, prescriptions, medication records, AI review
                queues, and pharmacy activity from one protected dashboard.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="font-medium text-white">Safety-first design</p>
                <p className="mt-1 text-slate-400">
                  AI suggestions support pharmacy review. They do not replace
                  licensed medical professionals.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="font-medium text-white">Role-ready foundation</p>
                <p className="mt-1 text-slate-400">
                  Built for user, pharmacist, and admin access patterns.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex justify-center lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Pill className="size-5" />
                </div>

                <div>
                  <p className="text-lg font-semibold tracking-tight">
                    AgentShefa
                  </p>
                  <p className="text-sm text-slate-500">AI pharmacy system</p>
                </div>
              </div>
            </div>

            <Card className="rounded-3xl border-slate-200 shadow-xl shadow-slate-200/60">
              <CardHeader className="space-y-2 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <LockKeyhole className="size-5" />
                </div>

                <CardTitle className="text-2xl tracking-tight">
                  Welcome back
                </CardTitle>

                <CardDescription>
                  Sign in to access your secure pharmacy dashboard.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {errors.root ? (
                  <div
                    role="alert"
                    className="mb-5 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                  >
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <p>{errors.root}</p>
                  </div>
                ) : null}

                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-700"
                    >
                      Email address
                    </label>

                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={form.email}
                        disabled={isSubmitting}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                          errors.email ? "email-error" : undefined
                        }
                        onChange={(event) =>
                          updateField("email", event.target.value)
                        }
                        className="h-11 rounded-xl pl-10"
                      />
                    </div>

                    {errors.email ? (
                      <p id="email-error" className="text-sm text-red-600">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <label
                        htmlFor="password"
                        className="text-sm font-medium text-slate-700"
                      >
                        Password
                      </label>

                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-slate-950 underline-offset-4 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={form.password}
                        disabled={isSubmitting}
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={
                          errors.password ? "password-error" : undefined
                        }
                        onChange={(event) =>
                          updateField("password", event.target.value)
                        }
                        className="h-11 rounded-xl pl-10 pr-10"
                      />

                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md text-slate-400 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>

                    {errors.password ? (
                      <p id="password-error" className="text-sm text-red-600">
                        {errors.password}
                      </p>
                    ) : null}
                  </div>

                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={form.rememberMe}
                      disabled={isSubmitting}
                      onChange={(event) =>
                        updateField("rememberMe", event.target.checked)
                      }
                      className="size-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950"
                    />
                    Remember me
                  </label>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </form>

                <div className="mt-6 rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-900">
                    Protected healthcare workspace
                  </p>
                  <p className="mt-1">
                    Access is restricted to authorized users. Patient and
                    prescription data should only be handled by approved staff.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}

export function LoginForm() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Loader2 className="size-4 animate-spin" />
            Loading secure sign in...
          </div>
        </main>
      }
    >
      <LoginFormInner />
    </Suspense>
  )
}