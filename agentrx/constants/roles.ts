export const APP_ROLES = {
    USER: "USER",
    PHARMACIST: "PHARMACIST",
    ADMIN: "ADMIN",
  } as const
  
  export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES]
  
  export const ROLE_LABELS: Record<AppRole, string> = {
    USER: "User",
    PHARMACIST: "Pharmacist",
    ADMIN: "Admin",
  }
  
  export const ROLE_DESCRIPTIONS: Record<AppRole, string> = {
    USER: "Basic authenticated user access.",
    PHARMACIST:
      "Can access pharmacy workflows, review prescriptions, and manage prescription records.",
    ADMIN:
      "Can manage users, roles, platform settings, and administrative workflows.",
  }
  
  export const PROTECTED_ROLES = [
    APP_ROLES.USER,
    APP_ROLES.PHARMACIST,
    APP_ROLES.ADMIN,
  ] as const
  
  export const DASHBOARD_ACCESS_ROLES = [
    APP_ROLES.PHARMACIST,
    APP_ROLES.ADMIN,
  ] as const
  
  export const ADMIN_ACCESS_ROLES = [APP_ROLES.ADMIN] as const
  
  export function isAppRole(value: unknown): value is AppRole {
    return Object.values(APP_ROLES).includes(value as AppRole)
  }
  
  export function canAccessDashboard(role?: string | null) {
    if (!isAppRole(role)) return false
  
    return DASHBOARD_ACCESS_ROLES.includes(
      role as (typeof DASHBOARD_ACCESS_ROLES)[number]
    )
  }
  
  export function canAccessAdmin(role?: string | null) {
    if (!isAppRole(role)) return false
  
    return ADMIN_ACCESS_ROLES.includes(
      role as (typeof ADMIN_ACCESS_ROLES)[number]
    )
  }