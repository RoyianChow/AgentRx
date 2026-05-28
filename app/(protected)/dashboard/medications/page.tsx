import { MedicationsClient } from "@/features/medications/components/medications-client"
import { db } from "@/lib/db"

export default async function MedicationsPage() {
  const medications = await db.medication.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
    select: {
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
    },
  })

  const medicationRows = medications.map((medication) => ({
    ...medication,
    drugSchedule: medication.drugSchedule.toString(),
    status: medication.status.toString(),
    storageRequirement: medication.storageRequirement.toString(),
    unitOfMeasure: medication.unitOfMeasure.toString(),
    stockQuantity: medication.stockQuantity?.toString() ?? "0",
    reorderLevel: medication.reorderLevel?.toString() ?? null,
    expiryDate: medication.expiryDate
      ? medication.expiryDate.toISOString().slice(0, 10)
      : null,
  }))

  return <MedicationsClient initialMedications={medicationRows} />
}