export type AppRole = "USER" | "PHARMACIST" | "ADMIN"

export type PrescriptionQueueItem = {
  id: string
  patient: string
  medication: string
  status: "Needs Review" | "Processing" | "Ready"
  priority: "Low" | "Medium" | "High"
  time: string
}

export type DashboardSummary = {
  patientCount: number
  medicationCount: number
  prescriptionCount: number
  pendingPrescriptionCount: number
  aiReviewCount: number
  safetyFlagCount: number
}