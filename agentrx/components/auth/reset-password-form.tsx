"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useMemo, useState } from "react"
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Pill,
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

type ResetPasswordErrors = {
  password?: string
  confirmPassword?: string
  root?: string
}

function ResetPasswordFormInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = useMemo(() => searchParams.get("token"), [searchParams])
  const urlError = useMemo(() => searchParams.get("error"), [searchParams])

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<ResetPasswordErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function validateForm() {
    const nextErrors: ResetPasswordErrors = {}

    if (!password) {
      nextErrors.password = "New password is required."
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters."
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password."
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match."
    }

    if (!token) {
      nextErrors.root =
        "This reset link is missing a token. Please request a new link."
    }

    if (urlError) {
      nextErrors.root =
        "This reset link is invalid or expired. Please request a new link."
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) return
    if (!validateForm()) return
    if (!token) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      })

      if (error) {
        setErrors({
          root:
            error.message ||
            "We could not reset your password. Please request a new link.",
        })
        return
      }

      setIsSuccess(true)

      setTimeout(() => {
        router.replace("/login")
      }, 1200)
    } catch {
      setErrors({
        root: "Something went wrong. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-950">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
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
              {isSuccess ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <LockKeyhole className="size-5" />
              )}
            </div>

            <CardTitle className="text-2xl tracking-tight">
              {isSuccess ? "Password updated" : "Create new password"}
            </CardTitle>

            <CardDescription>
              {isSuccess
                ? "Your password has been reset. Redirecting to login..."
                : "Choose a strong password for your AgentShefa account."}
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

            {isSuccess ? (
              <Button asChild className="h-11 w-full rounded-xl">
                <Link href="/login">Go to login</Link>
              </Button>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700"
                  >
                    New password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Enter new password"
                      value={password}
                      disabled={isSubmitting}
                      onChange={(event) => {
                        setPassword(event.target.value)
                        setErrors({})
                      }}
                      className="h-11 rounded-xl pl-10 pr-10"
                    />

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>

                  {errors.password ? (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-slate-700"
                  >
                    Confirm password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      disabled={isSubmitting}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value)
                        setErrors({})
                      }}
                      className="h-11 rounded-xl pl-10 pr-10"
                    />

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() =>
                        setShowConfirmPassword((value) => !value)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword ? (
                    <p className="text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  ) : null}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !token || Boolean(urlError)}
                  className="h-11 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Updating password...
                    </>
                  ) : (
                    "Reset password"
                  )}
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  className="h-11 w-full rounded-xl"
                >
                  <Link href="/forgot-password">Request a new link</Link>
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Loader2 className="size-4 animate-spin" />
            Loading reset form...
          </div>
        </main>
      }
    >
      <ResetPasswordFormInner />
    </Suspense>
  )
}