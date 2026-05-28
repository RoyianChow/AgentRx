import "dotenv/config"

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../lib/generated/prisma/client"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing")
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const db = new PrismaClient({
  adapter,
})

const medications = [
  {
    din: "00000001",
    name: "Acetaminophen 500 mg Tablet",
    brandName: "Tylenol",
    genericName: "Acetaminophen",
    manufacturer: "Johnson & Johnson",
    strength: "500 mg",
    dosage: "1-2 tablets every 4-6 hours as needed",
    form: "Tablet",
    route: "Oral",
    description: "Pain reliever and fever reducer.",
    stockQuantity: "250.000",
    reorderLevel: "50.000",
    storageLocation: "Aisle 1 - Shelf A",
    lotNumber: "TYL-500-A1",
    expiryDate: new Date("2027-12-31"),
    requiresCounselling: false,
    pharmacistNotes: "Monitor total daily acetaminophen intake.",
  },
  {
    din: "00000002",
    name: "Ibuprofen 200 mg Tablet",
    brandName: "Advil",
    genericName: "Ibuprofen",
    manufacturer: "Haleon",
    strength: "200 mg",
    dosage: "1 tablet every 6-8 hours as needed.",
    form: "Tablet",
    route: "Oral",
    description: "NSAID used for pain, inflammation, and fever.",
    stockQuantity: "180.000",
    reorderLevel: "40.000",
    storageLocation: "Aisle 1 - Shelf B",
    lotNumber: "ADV-200-B2",
    expiryDate: new Date("2027-08-15"),
    requiresCounselling: true,
    pharmacistNotes:
      "Avoid in patients with stomach ulcers or kidney issues unless directed.",
  },
  {
    din: "00000003",
    name: "Amoxicillin 500 mg Capsule",
    brandName: "Amoxil",
    genericName: "Amoxicillin",
    manufacturer: "GSK",
    strength: "500 mg",
    dosage: "Take as prescribed by physician.",
    form: "Capsule",
    route: "Oral",
    description: "Antibiotic used to treat bacterial infections.",
    stockQuantity: "90.000",
    reorderLevel: "25.000",
    storageLocation: "Prescription Shelf - Antibiotics",
    lotNumber: "AMX-500-C3",
    expiryDate: new Date("2026-11-30"),
    requiresCounselling: true,
    pharmacistNotes: "Complete full course. Check for penicillin allergy.",
  },
  {
    din: "00000004",
    name: "Metformin 500 mg Tablet",
    brandName: "Glucophage",
    genericName: "Metformin",
    manufacturer: "Apotex",
    strength: "500 mg",
    dosage: "Take with meals as directed.",
    form: "Tablet",
    route: "Oral",
    description: "Used to help control blood sugar in type 2 diabetes.",
    stockQuantity: "140.000",
    reorderLevel: "35.000",
    storageLocation: "Prescription Shelf - Diabetes",
    lotNumber: "MET-500-D4",
    expiryDate: new Date("2028-01-20"),
    requiresCounselling: true,
    pharmacistNotes: "Counsel patient on GI side effects and taking with food.",
  },
  {
    din: "00000005",
    name: "Atorvastatin 20 mg Tablet",
    brandName: "Lipitor",
    genericName: "Atorvastatin",
    manufacturer: "Pfizer",
    strength: "20 mg",
    dosage: "Take once daily as prescribed.",
    form: "Tablet",
    route: "Oral",
    description: "Used to lower cholesterol and reduce cardiovascular risk.",
    stockQuantity: "120.000",
    reorderLevel: "30.000",
    storageLocation: "Prescription Shelf - Cardiovascular",
    lotNumber: "ATO-020-E5",
    expiryDate: new Date("2027-04-10"),
    requiresCounselling: true,
    pharmacistNotes: "Advise patient to report unexplained muscle pain.",
  },
  {
    din: "00000006",
    name: "Salbutamol 100 mcg Inhaler",
    brandName: "Ventolin",
    genericName: "Salbutamol",
    manufacturer: "GSK",
    strength: "100 mcg/dose",
    dosage: "Use as directed for shortness of breath or wheezing.",
    form: "Inhaler",
    route: "Inhalation",
    description: "Rescue inhaler for asthma or bronchospasm.",
    stockQuantity: "45.000",
    reorderLevel: "15.000",
    storageLocation: "Respiratory Section",
    lotNumber: "VEN-100-F6",
    expiryDate: new Date("2026-09-25"),
    requiresCounselling: true,
    pharmacistNotes: "Counsel on inhaler technique.",
  },
  {
    din: "00000007",
    name: "Insulin Glargine 100 units/mL",
    brandName: "Lantus",
    genericName: "Insulin Glargine",
    manufacturer: "Sanofi",
    strength: "100 units/mL",
    dosage: "Inject as directed by prescriber.",
    form: "Injection",
    route: "Subcutaneous",
    description: "Long-acting insulin for diabetes management.",
    stockQuantity: "35.000",
    reorderLevel: "10.000",
    storageLocation: "Fridge 1 - Diabetes",
    lotNumber: "LAN-100-G7",
    expiryDate: new Date("2026-07-01"),
    requiresCounselling: true,
    requiresRefrigeration: true,
    pharmacistNotes: "Store refrigerated. Do not freeze.",
  },
  {
    din: "00000008",
    name: "Nitroglycerin 0.4 mg Sublingual Tablet",
    brandName: "Nitrostat",
    genericName: "Nitroglycerin",
    manufacturer: "Pfizer",
    strength: "0.4 mg",
    dosage: "Use under tongue as directed for chest pain.",
    form: "Sublingual Tablet",
    route: "Sublingual",
    description: "Used for relief of angina symptoms.",
    stockQuantity: "30.000",
    reorderLevel: "10.000",
    storageLocation: "High Alert Cabinet",
    lotNumber: "NIT-004-H8",
    expiryDate: new Date("2026-06-15"),
    isHighAlert: true,
    requiresCounselling: true,
    pharmacistNotes: "Counsel patient on when to seek emergency help.",
  },
  {
    din: "00000009",
    name: "Hydromorphone 2 mg Tablet",
    brandName: "Dilaudid",
    genericName: "Hydromorphone",
    manufacturer: "Purdue",
    strength: "2 mg",
    dosage: "Take exactly as prescribed.",
    form: "Tablet",
    route: "Oral",
    description: "Opioid analgesic for severe pain.",
    stockQuantity: "20.000",
    reorderLevel: "5.000",
    storageLocation: "Controlled Substance Safe",
    lotNumber: "HYD-002-I9",
    expiryDate: new Date("2026-10-05"),
    isHighAlert: true,
    requiresCounselling: true,
    controlledSubstance: true,
    pharmacistNotes: "Controlled substance. Verify prescription carefully.",
  },
  {
    din: "00000010",
    name: "Cephalexin 500 mg Capsule",
    brandName: "Keflex",
    genericName: "Cephalexin",
    manufacturer: "Teva",
    strength: "500 mg",
    dosage: "Take as prescribed until finished.",
    form: "Capsule",
    route: "Oral",
    description: "Antibiotic used for bacterial infections.",
    stockQuantity: "75.000",
    reorderLevel: "20.000",
    storageLocation: "Prescription Shelf - Antibiotics",
    lotNumber: "CEP-500-J10",
    expiryDate: new Date("2027-02-18"),
    requiresCounselling: true,
    isLookAlikeSoundAlike: true,
    pharmacistNotes: "Check allergy history before dispensing.",
  },
]

async function main() {
  console.log("Seeding medication inventory...")

  for (const medication of medications) {
    await db.medication.upsert({
      where: {
        din: medication.din,
      },
      update: medication,
      create: medication,
    })
  }

  console.log(`Seeded ${medications.length} medications.`)
}

main()
  .catch((error) => {
    console.error("Seed failed:", error)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })