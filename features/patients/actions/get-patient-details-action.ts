"use server"

import { randomUUID } from "crypto"
import bcrypt from "bcryptjs"

import { env } from "@/env"
import { db } from "@/lib/db"
import { requireUser } from "@/lib/require-user"

export type PatientSecureDetails = {
  id: string
  fullName: string
  dateOfBirth: string | null
  phone: string | null
  email: string | null

  addressLine1: string | null
  addressLine2: string | null
  city: string | null
  province: string | null
  postalCode: string | null

  healthCardNumber: string | null
  healthCardVersion: string | null
  insuranceProvider: string | null
  drugPlanId: string | null

  allergies: string | null
  medicalConditions: string | null
  currentMedications: string | null
  preferredPharmacy: string | null

  primaryPhysicianName: string | null
  primaryPhysicianPhone: string | null

  emergencyContactName: string | null
  emergencyContactPhone: string | null
  emergencyContactRelationship: string | null

  preferredContactMethod: string
  consentToContact: boolean
  consentToCollectHealthInfo: boolean

  notes: string | null
  createdAt: string
  updatedAt: string
}

export type GetPatientDetailsActionResult =
  | {
      success: true
      patient: PatientSecureDetails
    }
  | {
      success: false
      message: string
    }

type PatientAccessLogPayload = {
  requestId: string
  patientId?: string
  userId?: string
  userRole?: string | null
  reason?: string
  error?: unknown
}

function logPatientAccessInfo(
  event: string,
  payload: PatientAccessLogPayload
) {
  console.info(`[patient_access.${event}]`, {
    requestId: payload.requestId,
    patientId: payload.patientId,
    userId: payload.userId,
    userRole: payload.userRole,
    reason: payload.reason,
  })
}

function logPatientAccessWarn(
  event: string,
  payload: PatientAccessLogPayload
) {
  console.warn(`[patient_access.${event}]`, {
    requestId: payload.requestId,
    patientId: payload.patientId,
    userId: payload.userId,
    userRole: payload.userRole,
    reason: payload.reason,
  })
}

function logPatientAccessError(
  event: string,
  payload: PatientAccessLogPayload
) {
  console.error(`[patient_access.${event}]`, {
    requestId: payload.requestId,
    patientId: payload.patientId,
    userId: payload.userId,
    userRole: payload.userRole,
    reason: payload.reason,
    error: payload.error,
  })
}

function canOpenPatientRecords(role?: string | null) {
  return role === "ADMIN" || role === "PHARMACIST"
}

function isValidBcryptHash(hash: string) {
  return hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$")
}

export async function getPatientDetailsAction({
  patientId,
  accessPassword,
}: {
  patientId: string
  accessPassword: string
}): Promise<GetPatientDetailsActionResult> {
  const requestId = randomUUID()

  try {
    const user = await requireUser()

    logPatientAccessInfo("attempt", {
      requestId,
      patientId,
      userId: user.id,
      userRole: user.role,
      reason: "User attempted to open protected patient record.",
    })

    if (!patientId?.trim()) {
      logPatientAccessWarn("missing_patient_id", {
        requestId,
        userId: user.id,
        userRole: user.role,
        reason: "No patient ID was provided.",
      })

      return {
        success: false,
        message: "Patient record could not be opened.",
      }
    }

    if (!canOpenPatientRecords(user.role)) {
      logPatientAccessWarn("permission_denied", {
        requestId,
        patientId,
        userId: user.id,
        userRole: user.role,
        reason: "User role is not allowed to open patient records.",
      })

      return {
        success: false,
        message: "You do not have permission to open patient records.",
      }
    }

    if (!accessPassword?.trim()) {
      logPatientAccessWarn("missing_access_password", {
        requestId,
        patientId,
        userId: user.id,
        userRole: user.role,
        reason: "Patient record access password was empty.",
      })

      return {
        success: false,
        message: "Patient record access password is required.",
      }
    }

    const accessPasswordHash = env.PATIENT_RECORD_ACCESS_PASSWORD_HASH

    if (!accessPasswordHash || !isValidBcryptHash(accessPasswordHash)) {
      logPatientAccessError("invalid_password_hash_config", {
        requestId,
        patientId,
        userId: user.id,
        userRole: user.role,
        reason:
          "PATIENT_RECORD_ACCESS_PASSWORD_HASH is missing or is not a valid bcrypt hash.",
      })

      return {
        success: false,
        message:
          "Patient record access is not configured correctly. Please contact an administrator.",
      }
    }

    const passwordIsValid = await bcrypt.compare(
      accessPassword,
      accessPasswordHash
    )

    if (!passwordIsValid) {
      logPatientAccessWarn("invalid_access_password", {
        requestId,
        patientId,
        userId: user.id,
        userRole: user.role,
        reason: "Invalid patient record access password.",
      })

      return {
        success: false,
        message: "Invalid patient record access password.",
      }
    }

    const patient = await db.patient.findUnique({
      where: {
        id: patientId,
      },
      select: {
        id: true,
        fullName: true,
        dateOfBirth: true,
        phone: true,
        email: true,

        addressLine1: true,
        addressLine2: true,
        city: true,
        province: true,
        postalCode: true,

        healthCardNumber: true,
        healthCardVersion: true,
        insuranceProvider: true,
        drugPlanId: true,

        allergies: true,
        medicalConditions: true,
        currentMedications: true,
        preferredPharmacy: true,

        primaryPhysicianName: true,
        primaryPhysicianPhone: true,

        emergencyContactName: true,
        emergencyContactPhone: true,
        emergencyContactRelationship: true,

        preferredContactMethod: true,
        consentToContact: true,
        consentToCollectHealthInfo: true,

        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!patient) {
      logPatientAccessWarn("patient_not_found", {
        requestId,
        patientId,
        userId: user.id,
        userRole: user.role,
        reason: "Patient record was not found.",
      })

      return {
        success: false,
        message: "Patient record was not found.",
      }
    }

    logPatientAccessInfo("success", {
      requestId,
      patientId,
      userId: user.id,
      userRole: user.role,
      reason: "Patient record unlocked successfully.",
    })

    return {
      success: true,
      patient: {
        ...patient,
        dateOfBirth: patient.dateOfBirth?.toISOString() ?? null,
        createdAt: patient.createdAt.toISOString(),
        updatedAt: patient.updatedAt.toISOString(),
      },
    }
  } catch (error) {
    logPatientAccessError("unexpected_error", {
      requestId,
      patientId,
      reason: "Unexpected error while opening patient record.",
      error,
    })

    return {
      success: false,
      message: "Unable to open patient record. Please try again.",
    }
  }
}