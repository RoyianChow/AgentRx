"use server"

import { revalidatePath } from "next/cache"

import { ROUTES } from "@/constants"
import { db } from "@/lib/db"
import { requireUser } from "@/lib/require-user"
import { patientIntakeSchema } from "@/features/patients/schemas/patient-intake-schema"

export type CreatePatientActionState = {
  success: boolean
  message: string
  patientId?: string
  fieldErrors?: Record<string, string[]>
}

function parseDate(value?: string | null) {
    if (!value) return null
  
    const trimmedValue = value.trim()
  
    if (!trimmedValue) return null
  
    const datePattern = /^\d{4}-\d{2}-\d{2}$/
  
    if (!datePattern.test(trimmedValue)) {
      return null
    }
  
    const date = new Date(`${trimmedValue}T00:00:00.000Z`)
  
    if (Number.isNaN(date.getTime())) {
      return null
    }
  
    return date
  }

export async function createPatientAction(
  _previousState: CreatePatientActionState,
  formData: FormData
): Promise<CreatePatientActionState> {
  const user = await requireUser()

  const rawInput = Object.fromEntries(formData.entries())
  const parsed = patientIntakeSchema.safeParse(rawInput)

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const input = parsed.data

  try {
    const patient = await db.patient.create({
      data: {
        fullName: input.fullName,
        dateOfBirth: parseDate(input.dateOfBirth),

        phone: input.phone,
        email: input.email,

        addressLine1: input.addressLine1,
        addressLine2: input.addressLine2,
        city: input.city,
        province: input.province || "ON",
        postalCode: input.postalCode,

        healthCardNumber: input.healthCardNumber,
        healthCardVersion: input.healthCardVersion,
        insuranceProvider: input.insuranceProvider,
        drugPlanId: input.drugPlanId,

        allergies: input.allergies,
        medicalConditions: input.medicalConditions,
        currentMedications: input.currentMedications,
        preferredPharmacy: input.preferredPharmacy,

        primaryPhysicianName: input.primaryPhysicianName,
        primaryPhysicianPhone: input.primaryPhysicianPhone,

        emergencyContactName: input.emergencyContactName,
        emergencyContactPhone: input.emergencyContactPhone,
        emergencyContactRelationship: input.emergencyContactRelationship,

        preferredContactMethod: input.preferredContactMethod,
        consentToContact: input.consentToContact,
        consentToCollectHealthInfo: input.consentToCollectHealthInfo,

        notes: input.notes,

        createdById: user.id,
      },
    })

    revalidatePath(ROUTES.DASHBOARD.PATIENTS)

    return {
      success: true,
      message: "Patient profile created successfully.",
      patientId: patient.id,
    }
  } catch (error) {
    console.error("[create_patient.failed]", error)

    return {
      success: false,
      message: "Unable to create patient profile. Please try again.",
    }
  }
}