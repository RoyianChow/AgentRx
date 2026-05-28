"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import crypto from "crypto"

import { db } from "@/lib/db"

const MEDICATIONS_PATH = "/dashboard/medications"

const medicationSelect = {
  id: true,
  name: true,
  din: true,
  brandName: true,
  genericName: true,
  manufacturer: true,
  strength: true,
  dosage: true,
  form: true,
  route: true,
  description: true,

  drugSchedule: true,
  status: true,
  storageRequirement: true,

  stockQuantity: true,
  reorderLevel: true,
  unitOfMeasure: true,
  storageLocation: true,
  lotNumber: true,
  expiryDate: true,

  isHighAlert: true,
  isLookAlikeSoundAlike: true,
  requiresCounselling: true,
  requiresRefrigeration: true,
  controlledSubstance: true,

  pharmacistNotes: true,
}

const optionalString = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value

    const trimmed = value.trim()
    return trimmed === "" ? undefined : trimmed
  },
  z.string().trim().optional()
)

const optionalDecimal = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value

    const trimmed = value.trim()
    if (trimmed === "") return undefined

    const number = Number(trimmed)
    return Number.isNaN(number) ? value : number
  },
  z.number().nonnegative("Quantity cannot be negative.").optional()
)

const optionalDate = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value

    const trimmed = value.trim()
    return trimmed === "" ? undefined : trimmed
  },
  z
    .string()
    .optional()
    .refine((value) => !value || !Number.isNaN(new Date(value).getTime()), {
      message: "Expiry date is invalid.",
    })
)

const checkbox = z.preprocess((value) => value === "on", z.boolean())

const medicationSchema = z.object({
  name: z.string().trim().min(2, "Medication name is required"),

  din: optionalString.refine(
    (value) => !value || /^\d{8}$/.test(value),
    "DIN must be exactly 8 digits"
  ),

  brandName: optionalString,
  genericName: optionalString,
  manufacturer: optionalString,
  strength: optionalString,
  dosage: optionalString,
  form: optionalString,
  route: optionalString,
  description: optionalString,

  drugSchedule: z
    .enum([
      "PRESCRIPTION",
      "OTC",
      "NAPRA_SCHEDULE_II",
      "NAPRA_SCHEDULE_III",
      "NARCOTIC",
      "CONTROLLED_DRUG",
      "TARGETED_SUBSTANCE",
      "BIOLOGIC",
      "UNKNOWN",
    ])
    .default("UNKNOWN"),

  status: z
    .enum(["ACTIVE", "DISCONTINUED", "BACKORDERED", "RECALLED", "ON_HOLD"])
    .default("ACTIVE"),

  storageRequirement: z
    .enum([
      "ROOM_TEMPERATURE",
      "REFRIGERATED",
      "FROZEN",
      "PROTECT_FROM_LIGHT",
      "CONTROLLED_SUBSTANCE_LOCKED",
      "OTHER",
    ])
    .default("ROOM_TEMPERATURE"),

  stockQuantity: optionalDecimal,
  reorderLevel: optionalDecimal,

  unitOfMeasure: z
    .enum([
      "TABLET",
      "CAPSULE",
      "ML",
      "MG",
      "G",
      "PATCH",
      "VIAL",
      "INHALER",
      "BOTTLE",
      "PACKAGE",
      "UNIT",
    ])
    .default("UNIT"),

  storageLocation: optionalString,
  lotNumber: optionalString,
  expiryDate: optionalDate,

  isHighAlert: checkbox,
  isLookAlikeSoundAlike: checkbox,
  requiresCounselling: checkbox,
  requiresRefrigeration: checkbox,
  controlledSubstance: checkbox,

  pharmacistNotes: optionalString,
})


function verifyMedicationPassword(password: string) {
  const expectedPassword = process.env.MEDICATION_ADMIN_PASSWORD

  if (!expectedPassword) {
    return {
      success: false,
      message: "Medication admin password is not configured.",
    }
  }

  const passwordBuffer = Buffer.from(password)
  const expectedBuffer = Buffer.from(expectedPassword)

  if (passwordBuffer.length !== expectedBuffer.length) {
    return {
      success: false,
      message: "Invalid medication admin password.",
    }
  }

  const isValid = crypto.timingSafeEqual(passwordBuffer, expectedBuffer)

  if (!isValid) {
    return {
      success: false,
      message: "Invalid medication admin password.",
    }
  }

  return {
    success: true,
    message: "Password verified.",
  }
}

function parseMedicationForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries())
  return medicationSchema.safeParse(raw)
}

function toMedicationData(data: z.infer<typeof medicationSchema>) {
  return {
    name: data.name,
    din: data.din ?? null,
    brandName: data.brandName ?? null,
    genericName: data.genericName ?? null,
    manufacturer: data.manufacturer ?? null,
    strength: data.strength ?? null,
    dosage: data.dosage ?? null,
    form: data.form ?? null,
    route: data.route ?? null,
    description: data.description ?? null,

    drugSchedule: data.drugSchedule,
    status: data.status,
    storageRequirement: data.storageRequirement,

    stockQuantity: data.stockQuantity ?? 0,
    reorderLevel: data.reorderLevel ?? null,
    unitOfMeasure: data.unitOfMeasure,
    storageLocation: data.storageLocation ?? null,
    lotNumber: data.lotNumber ?? null,
    expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,

    isHighAlert: data.isHighAlert,
    isLookAlikeSoundAlike: data.isLookAlikeSoundAlike,
    requiresCounselling: data.requiresCounselling,
    requiresRefrigeration: data.requiresRefrigeration,
    controlledSubstance: data.controlledSubstance,

    pharmacistNotes: data.pharmacistNotes ?? null,
  }
}

function serializeMedication(medication: {
  id: string
  name: string
  din: string | null
  brandName: string | null
  genericName: string | null
  manufacturer: string | null
  strength: string | null
  dosage: string | null
  form: string | null
  route: string | null
  description: string | null
  drugSchedule: unknown
  status: unknown
  storageRequirement: unknown
  stockQuantity: { toString: () => string } | null
  reorderLevel: { toString: () => string } | null
  unitOfMeasure: unknown
  storageLocation: string | null
  lotNumber: string | null
  expiryDate: Date | null
  isHighAlert: boolean
  isLookAlikeSoundAlike: boolean
  requiresCounselling: boolean
  requiresRefrigeration: boolean
  controlledSubstance: boolean
  pharmacistNotes: string | null
}) {
  return {
    ...medication,
    drugSchedule: medication.drugSchedule?.toString() ?? "UNKNOWN",
    status: medication.status?.toString() ?? "ACTIVE",
    storageRequirement:
      medication.storageRequirement?.toString() ?? "ROOM_TEMPERATURE",
    unitOfMeasure: medication.unitOfMeasure?.toString() ?? "UNIT",
    stockQuantity: medication.stockQuantity?.toString() ?? "0",
    reorderLevel: medication.reorderLevel?.toString() ?? null,
    expiryDate: medication.expiryDate
      ? medication.expiryDate.toISOString().slice(0, 10)
      : null,
  }
}

export async function createMedication(formData: FormData, password:string) {
  const passwordCheck = verifyMedicationPassword(password)

  if (!passwordCheck.success) {
    return {
      success: false,
      message: passwordCheck.message,
      medication: null,
    }
  }
  const parsed = parseMedicationForm(formData)

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid medication data.",
      medication: null,
    }
  }

  try {
    const medication = await db.medication.create({
      data: toMedicationData(parsed.data),
      select: medicationSelect,
    })

    revalidatePath(MEDICATIONS_PATH)

    return {
      success: true,
      message: "Medication added successfully.",
      medication: serializeMedication(medication),
    }
  } catch (error) {
    console.error("Create medication error:", error)

    return {
      success: false,
      message:
        "Medication could not be created. Check if the DIN already exists.",
      medication: null,
    }
  }
}

export async function updateMedication(id: string, formData: FormData, password:string) {
  const passwordCheck = verifyMedicationPassword(password)

  if (!passwordCheck.success) {
    return {
      success: false,
      message: passwordCheck.message,
      medication: null,
    }
  }
  const parsed = parseMedicationForm(formData)

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid medication data.",
      medication: null,
    }
  }

  try {
    const medication = await db.medication.update({
      where: {
        id,
      },
      data: toMedicationData(parsed.data),
      select: medicationSelect,
    })

    revalidatePath(MEDICATIONS_PATH)

    return {
      success: true,
      message: "Medication updated successfully.",
      medication: serializeMedication(medication),
    }
  } catch (error) {
    console.error("Update medication error:", error)

    return {
      success: false,
      message:
        "Medication could not be updated. Check if the DIN already exists.",
      medication: null,
    }
  }
}

export async function deleteMedication(id: string, password:string) {
  const passwordCheck = verifyMedicationPassword(password)

  if (!passwordCheck.success) {
    return {
      success: false,
      message: passwordCheck.message,
      medication: null,
    }
  }
  try {
    const medication = await db.medication.delete({
      where: {
        id,
      },
      select: medicationSelect,
    })

    revalidatePath(MEDICATIONS_PATH)

    return {
      success: true,
      message: "Medication deleted successfully.",
      medication: serializeMedication(medication),
    }
  } catch (error) {
    console.error("Delete medication error:", error)

    return {
      success: false,
      message:
        "Medication could not be deleted. It may already be connected to a prescription.",
      medication: null,
    }
  }
}