import { Pill, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { PrescriptionQueueItem } from "@/types"

const defaultQueue: PrescriptionQueueItem[] = [
  {
    id: "rx-001",
    patient: "Amina Rahman",
    medication: "Metformin 500mg",
    status: "Needs Review",
    priority: "High",
    time: "12 min ago",
  },
  {
    id: "rx-002",
    patient: "Daniel Lee",
    medication: "Amoxicillin 250mg",
    status: "Processing",
    priority: "Medium",
    time: "25 min ago",
  },
  {
    id: "rx-003",
    patient: "Sarah Khan",
    medication: "Atorvastatin 20mg",
    status: "Ready",
    priority: "Low",
    time: "42 min ago",
  },
]

function getPriorityClass(priority: PrescriptionQueueItem["priority"]) {
  if (priority === "High") {
    return "border-red-200 bg-red-50 text-red-700"
  }

  if (priority === "Medium") {
    return "border-yellow-200 bg-yellow-50 text-yellow-700"
  }

  return "border-green-200 bg-green-50 text-green-700"
}

function getStatusClass(status: PrescriptionQueueItem["status"]) {
  if (status === "Needs Review") {
    return "border-red-200 bg-red-50 text-red-700"
  }

  if (status === "Processing") {
    return "border-blue-200 bg-blue-50 text-blue-700"
  }

  return "border-green-200 bg-green-50 text-green-700"
}

export function PrescriptionQueue({
  items = defaultQueue,
}: {
  items?: PrescriptionQueueItem[]
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Prescription Queue</CardTitle>
          <CardDescription>
            Prescriptions waiting for review, processing, or pickup.
          </CardDescription>
        </div>

        <Button className="rounded-xl">
          <Plus className="mr-2 size-4" />
          New Prescription
        </Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                  <Pill className="size-5 text-slate-700" />
                </div>

                <div>
                  <p className="font-medium">{item.patient}</p>
                  <p className="text-sm text-slate-500">{item.medication}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.time}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(getStatusClass(item.status))}
                >
                  {item.status}
                </Badge>

                <Badge
                  variant="outline"
                  className={cn(getPriorityClass(item.priority))}
                >
                  {item.priority}
                </Badge>

                <Button variant="outline" className="rounded-xl">
                  Open
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}