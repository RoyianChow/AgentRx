import { Plus, Users } from "lucide-react"

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

export default async function PatientsPage() {
  const patients = await db.patient.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Patients</h2>
          <p className="text-sm text-slate-500">
            Manage patient profiles and connect them to prescription workflows.
          </p>
        </div>

        <Button className="rounded-xl">
          <Plus className="mr-2 size-4" />
          Add Patient
        </Button>
      </div>

      {patients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No patients yet"
          description="Create your first patient profile to begin managing prescriptions and medication history."
          actionLabel="Add Patient"
        />
      ) : (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Patient Records</CardTitle>
            <CardDescription>Latest patient profiles.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex flex-col justify-between gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="font-medium">{patient.fullName}</p>
                    <p className="text-sm text-slate-500">
                      {patient.email || patient.phone || "No contact added"}
                    </p>
                  </div>

                  <Button variant="outline" className="rounded-xl">
                    Open
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}