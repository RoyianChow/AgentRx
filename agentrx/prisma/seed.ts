import "dotenv/config"

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../lib/generated/prisma/client"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing")
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  const demoUser = await prisma.user.upsert({
    where: {
      email: "pharmacist.demo@agentshefa.com",
    },
    update: {
      name: "Demo Pharmacist",
      role: "PHARMACIST",
      emailVerified: true,
    },
    create: {
      name: "Demo Pharmacist",
      email: "pharmacist.demo@agentshefa.com",
      emailVerified: true,
      role: "PHARMACIST",
    },
  })

  const dummyPatients = [
    {
      fullName: "Amina Rahman",
      dateOfBirth: new Date("1992-04-18T00:00:00.000Z"),
      phone: "416-555-0123",
      email: "amina.rahman@example.com",
      addressLine1: "88 Example Avenue",
      city: "Toronto",
      province: "ON",
      postalCode: "M4B 1B3",
      healthCardNumber: "0000-000-000",
      healthCardVersion: "AA",
      insuranceProvider: "Ontario Drug Benefit",
      drugPlanId: "ODB-SAMPLE-001",
      allergies: "Penicillin allergy. Synthetic demo data only.",
      medicalConditions: "Type 2 diabetes. Hypertension.",
      currentMedications: "Metformin 500mg, Lisinopril 10mg.",
      preferredPharmacy: "AgentShefa Demo Pharmacy",
      primaryPhysicianName: "Dr. Maya Thompson",
      primaryPhysicianPhone: "416-555-0198",
      emergencyContactName: "Nadia Rahman",
      emergencyContactPhone: "647-555-0199",
      emergencyContactRelationship: "Sister",
      preferredContactMethod: "PHONE",
      consentToContact: true,
      consentToCollectHealthInfo: true,
      notes: "Synthetic Ontario patient profile for software testing only.",
      createdById: demoUser.id,
    },
    {
      fullName: "Daniel Lee",
      dateOfBirth: new Date("1986-11-03T00:00:00.000Z"),
      phone: "647-555-0145",
      email: "daniel.lee@example.com",
      addressLine1: "120 Demo Road",
      addressLine2: "Unit 502",
      city: "Mississauga",
      province: "ON",
      postalCode: "L5B 2C9",
      healthCardNumber: "1111-111-111",
      healthCardVersion: "BB",
      insuranceProvider: "Private Plan",
      drugPlanId: "PRIV-SAMPLE-8821",
      allergies: "No known drug allergies.",
      medicalConditions: "Seasonal allergies.",
      currentMedications: "Cetirizine 10mg as needed.",
      preferredPharmacy: "AgentShefa Demo Pharmacy",
      primaryPhysicianName: "Dr. Alex Morgan",
      primaryPhysicianPhone: "905-555-0102",
      emergencyContactName: "Emily Lee",
      emergencyContactPhone: "416-555-0188",
      emergencyContactRelationship: "Spouse",
      preferredContactMethod: "SMS",
      consentToContact: true,
      consentToCollectHealthInfo: true,
      notes: "Synthetic patient profile. Do not use for real care.",
      createdById: demoUser.id,
    },
    {
      fullName: "Sarah Khan",
      dateOfBirth: new Date("1974-07-22T00:00:00.000Z"),
      phone: "289-555-0177",
      email: "sarah.khan@example.com",
      addressLine1: "45 Sample Crescent",
      city: "Brampton",
      province: "ON",
      postalCode: "L6Y 1A1",
      healthCardNumber: "2222-222-222",
      healthCardVersion: "CC",
      insuranceProvider: "Ontario Drug Benefit",
      drugPlanId: "ODB-SAMPLE-003",
      allergies: "Sulfa allergy.",
      medicalConditions: "Hyperlipidemia.",
      currentMedications: "Atorvastatin 20mg.",
      preferredPharmacy: "AgentShefa Demo Pharmacy",
      primaryPhysicianName: "Dr. Priya Shah",
      primaryPhysicianPhone: "905-555-0155",
      emergencyContactName: "Omar Khan",
      emergencyContactPhone: "647-555-0161",
      emergencyContactRelationship: "Son",
      preferredContactMethod: "EMAIL",
      consentToContact: true,
      consentToCollectHealthInfo: true,
      notes: "Synthetic Ontario pharmacy intake test record.",
      createdById: demoUser.id,
    },
  ] as const

  for (const patient of dummyPatients) {
    const existingPatient = await prisma.patient.findFirst({
      where: {
        email: patient.email,
      },
      select: {
        id: true,
      },
    })

    if (existingPatient) {
      await prisma.patient.update({
        where: {
          id: existingPatient.id,
        },
        data: patient,
      })
    } else {
      await prisma.patient.create({
        data: patient,
      })
    }
  }

  console.log("Dummy patient seed completed.")
  console.log(`Demo pharmacist: ${demoUser.email}`)
}

main()
  .catch((error) => {
    console.error("Seed failed:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })