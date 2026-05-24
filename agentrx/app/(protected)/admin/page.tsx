import { ShieldCheck, Users } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { requireAdmin } from "@/lib/require-user"
import { db } from "@/lib/db"

export default async function AdminPage() {
  await requireAdmin()

  const users = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    take: 50,
  })

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm text-slate-600">
            <ShieldCheck className="size-4 text-emerald-600" />
            Admin access
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            Admin Console
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage platform users, roles, and operational controls.
          </p>
        </div>

        {users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description="Once users sign in or are created, they will appear in the admin console."
          />
        ) : (
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Latest registered users.</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col justify-between gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="font-medium">{user.name || "Unnamed"}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>

                    <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {user.role}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}