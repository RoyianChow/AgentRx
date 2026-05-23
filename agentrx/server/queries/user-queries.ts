import "server-only"

import { db } from "@/lib/db"

export async function getDashboardSummary() {
  const [
    patientCount,
    medicationCount,
    prescriptionCount,
    pendingPrescriptionCount,
    aiReviewCount,
  ] = await Promise.all([
    db.patient.count(),
    db.medication.count(),
    db.prescription.count(),
    db.prescription.count({
      where: {
        status: "PENDING",
      },
    }),
    db.agentMessage.count(),
  ])

  return {
    patientCount,
    medicationCount,
    prescriptionCount,
    pendingPrescriptionCount,
    aiReviewCount,
    safetyFlagCount: 0,
  }
}

export async function getUserById(userId: string) {
  return db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}