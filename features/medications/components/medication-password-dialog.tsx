"use client"

import { useState } from "react"
import { Loader2, LockKeyhole } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type MedicationPasswordDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  isPending?: boolean
  error?: string
  onOpenChange: (open: boolean) => void
  onConfirm: (password: string) => void
}

export function MedicationPasswordDialog({
  open,
  title,
  description,
  confirmLabel,
  isPending = false,
  error,
  onOpenChange,
  onConfirm,
}: MedicationPasswordDialogProps) {
  const [password, setPassword] = useState("")
  const [prevOpen, setPrevOpen] = useState(open)

  if (open !== prevOpen) {
    setPrevOpen(open)
    if (!open) {
      setPassword("")
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!password.trim()) return

    onConfirm(password)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-2xl border bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            <LockKeyhole className="size-5" />
          </div>

          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="medication-admin-password">
              Medication admin password
            </Label>
            <Input
              id="medication-admin-password"
              type="password"
              value={password}
              disabled={isPending}
              placeholder="Enter password"
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error ? (
            <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="rounded-xl"
              disabled={isPending || !password.trim()}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                confirmLabel
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}