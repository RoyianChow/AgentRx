export const APP_CONFIG = {
    name: "AgentShefa",
    productName: "AgentRx",
    description: "AI-assisted pharmacy workflow platform",
    tagline: "AI pharmacy operating system",
    supportEmail: "support@agentshefa.com",
    defaultFromEmail: "AgentShefa <onboarding@resend.dev>",
    websiteUrl:
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  } as const
  
  export const APP_METADATA = {
    title: APP_CONFIG.name,
    description:
      "AgentShefa helps pharmacy teams upload prescriptions, extract structured fields, review AI-assisted results, and maintain an audit trail.",
    keywords: [
      "AI pharmacy",
      "prescription intake",
      "OCR",
      "pharmacy workflow",
      "pharmacist review",
      "audit log",
    ],
  } as const
  
  export const APP_LIMITS = {
    maxPrescriptionUploadSizeMb: 10,
    maxPrescriptionUploadSizeBytes: 10 * 1024 * 1024,
    passwordMinLength: 8,
    passwordResetCooldownSeconds: 20,
  } as const
  
  export const ACCEPTED_PRESCRIPTION_FILE_TYPES = {
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"],
    "application/pdf": [".pdf"],
  } as const
  
  export const ACCEPTED_PRESCRIPTION_MIME_TYPES = [
    "image/png",
    "image/jpeg",
    "application/pdf",
  ] as const