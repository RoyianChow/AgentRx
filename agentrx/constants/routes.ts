export const ROUTES = {
    HOME: "/",
  
    AUTH: {
      LOGIN: "/login",
      FORGOT_PASSWORD: "/forgot-password",
      RESET_PASSWORD: "/reset-password",
    },
  
    DASHBOARD: {
      ROOT: "/dashboard",
      PATIENTS: "/dashboard/patients",
      PRESCRIPTIONS: "/dashboard/prescriptions",
      PRESCRIPTION_UPLOAD: "/dashboard/prescriptions/upload",
      MEDICATIONS: "/dashboard/medications",
      ASSISTANT: "/dashboard/assistant",
      PROFILE: "/dashboard/profile",
SETTINGS: "/dashboard/settings",
    },
  
    ADMIN: {
      ROOT: "/admin",
    },
  
    API: {
      AUTH: "/api/auth",
      DB_TEST: "/api/db-test",
    },
  } as const
  
  export function getPrescriptionDetailRoute(prescriptionId: string) {
    return `/dashboard/prescriptions/${prescriptionId}`
  }
  
  export function getLoginRedirectRoute(redirectTo?: string) {
    if (!redirectTo) return ROUTES.AUTH.LOGIN
  
    return `${ROUTES.AUTH.LOGIN}?redirectTo=${encodeURIComponent(redirectTo)}`
  }
  
  export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.AUTH.LOGIN,
    ROUTES.AUTH.FORGOT_PASSWORD,
    ROUTES.AUTH.RESET_PASSWORD,
  ] as const
  
  export const PROTECTED_ROUTE_PREFIXES = [
    ROUTES.DASHBOARD.ROOT,
    ROUTES.ADMIN.ROOT,
  ] as const
  
  export function isPublicRoute(pathname: string) {
    return PUBLIC_ROUTES.some((route) => pathname === route)
  }
  
  export function isProtectedRoute(pathname: string) {
    return PROTECTED_ROUTE_PREFIXES.some((route) => pathname.startsWith(route))
  }