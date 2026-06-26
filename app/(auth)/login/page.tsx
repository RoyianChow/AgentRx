import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { LoginForm } from "@/features/auth/components/login-form"

export default function LoginPage() {
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
      <LoginForm />
    </Suspense>
  )
}
