import { Pill, Plus } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { db } from "@/lib/db"

export default async function MedicationsPage() {
  const medications = await db.medication.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Medications
          </h2>
          <p className="text-sm text-slate-500">
            Manage medication records, forms, dosage notes, and descriptions.
          </p>
        </div>

        <Button className="rounded-xl">
          <Plus className="mr-2 size-4" />
          Add Medication
        </Button>
      </div>

      {medications.length === 0 ? (
        <EmptyState
          icon={Pill}
          title="No medications yet"
          description="Add medications to build the foundation for prescription workflows and AI review context."
          actionLabel="Add Medication"
        />
      ) : (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Medication Library</CardTitle>
            <CardDescription>Medication records in your database.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {medications.map((medication) => (
                <div key={medication.id} className="rounded-2xl border p-4">
                  <p className="font-medium">{medication.name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {medication.dosage || "No dosage added"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {medication.form || "No form added"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}