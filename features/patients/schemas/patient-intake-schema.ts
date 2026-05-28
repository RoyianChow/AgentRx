import { z } from "zod"

const optionalText = z
  .string()
  .trim()
  .max(1000, "This field is too long.")
  .optional()
  .transform((value) => (value ? value : undefined))

const optionalShortText = z
  .string()
  .trim()
  .max(160, "This field is too long.")
  .optional()
  .transform((value) => (value ? value : undefined))

const optionalEmail = z
  .string()
  .trim()
  .toLowerCase()
  .optional()
  .transform((value) => (value ? value : undefined))
  .pipe(z.string().email("Enter a valid email.").optional())

const optionalPhone = z
  .string()
  .trim()
  .max(32, "Phone number is too long.")
  .optional()
  .transform((value) => (value ? value : undefined))

export const patientIntakeSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Patient full name is required.")
    .max(120, "Patient name is too long."),

  dateOfBirth: z
    .string()
    .optional()
    .transform((value) => (value ? value : undefined)),

  phone: optionalPhone,
  email: optionalEmail,

  addressLine1: optionalShortText,
  addressLine2: optionalShortText,
  city: optionalShortText,
  province: z.string().trim().default("ON"),
  postalCode: optionalShortText,

  healthCardNumber: optionalShortText,
  healthCardVersion: optionalShortText,
  insuranceProvider: optionalShortText,
  drugPlanId: optionalShortText,

  allergies: optionalText,
  medicalConditions: optionalText,
  currentMedications: optionalText,
  preferredPharmacy: optionalShortText,

  primaryPhysicianName: optionalShortText,
  primaryPhysicianPhone: optionalPhone,

  emergencyContactName: optionalShortText,
  emergencyContactPhone: optionalPhone,
  emergencyContactRelationship: optionalShortText,

  preferredContactMethod: z.enum(["PHONE", "EMAIL", "SMS", "NONE"]).default("PHONE"),

  consentToContact: z.preprocess(
    (value) => value === "on" || value === true,
    z.boolean()
  ),

  consentToCollectHealthInfo: z.preprocess(
    (value) => value === "on" || value === true,
    z.boolean().refine((value) => value === true, {
      message: "Patient consent is required before collecting health information.",
    })
  ),

  notes: optionalText,
})

export type PatientIntakeInput = z.infer<typeof patientIntakeSchema>