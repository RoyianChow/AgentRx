import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

export function getInitials(nameOrEmail?: string | null) {
  if (!nameOrEmail) return "AS"

  const value = nameOrEmail.trim()

  if (!value) return "AS"

  const parts = value
    .replace(/@.*/, "")
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}
