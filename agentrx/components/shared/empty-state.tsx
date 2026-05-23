import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-dashed bg-white p-8 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100">
          <Icon className="size-6 text-slate-700" />
        </div>

        <h2 className="mt-5 text-xl font-semibold tracking-tight">{title}</h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

        {actionLabel ? (
          <Button className="mt-6 rounded-xl">{actionLabel}</Button>
        ) : null}
      </div>
    </div>
  )
}