import {
    Activity,
    BadgeCheck,
    CalendarClock,
    CheckCircle2,
    ClipboardCheck,
    LockKeyhole,
    Mail,
    MapPin,
    Pill,
    ShieldCheck,
    Stethoscope,
    User,
    UserCog,
  } from "lucide-react"
  
  import { Badge } from "@/components/ui/badge"
  import { Button } from "@/components/ui/button"
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
  type UserRole = "ADMIN" | "PHARMACIST" | "STAFF"
  
  type ProfileUser = {
    name: string
    email: string
    role: UserRole
    licenseNumber?: string
    location: string
    department: string
    status: "ACTIVE" | "PENDING" | "SUSPENDED"
    lastLogin: string
    joinedAt: string
  }
  
  const user: ProfileUser = {
    name: "Royian Chowdhury",
    email: "royian@agentrx.com",
    role: "ADMIN",
    licenseNumber: "PHARM-2026-001",
    location: "Toronto, ON",
    department: "Clinical Operations",
    status: "ACTIVE",
    lastLogin: "Today at 9:42 AM",
    joinedAt: "May 2026",
  }
  
  const rolePermissions: Record<UserRole, string[]> = {
    ADMIN: [
      "Manage medication inventory",
      "Create, update, and delete medication records",
      "Review pharmacist notes",
      "Manage pharmacy staff access",
      "Access operational safety flags",
      "View system audit activity",
    ],
    PHARMACIST: [
      "Review medication inventory",
      "Update medication records",
      "Add pharmacist notes",
      "Review safety and counselling flags",
      "View prescription context",
    ],
    STAFF: [
      "View medication inventory",
      "Search medication records",
      "Review stock and storage details",
    ],
  }
  
  const activityItems = [
    {
      title: "Medication record updated",
      description: "Updated stock and safety flags for Atorvastatin.",
      time: "12 minutes ago",
    },
    {
      title: "Inventory review completed",
      description: "Reviewed low-stock and expiry alerts.",
      time: "Today",
    },
    {
      title: "Profile access verified",
      description: "Account security check completed successfully.",
      time: "Yesterday",
    },
  ]
  
  function getRoleLabel(role: UserRole) {
    if (role === "ADMIN") return "Administrator"
    if (role === "PHARMACIST") return "Pharmacist"
    return "Staff User"
  }
  
  function getStatusBadge(status: ProfileUser["status"]) {
    if (status === "ACTIVE") {
      return (
        <Badge className="rounded-full bg-emerald-50 text-emerald-950 hover:bg-emerald-50">
          <CheckCircle2 className="mr-1 size-3" />
          Active
        </Badge>
      )
    }
  
    if (status === "PENDING") {
      return (
        <Badge className="rounded-full bg-amber-50 text-amber-950 hover:bg-amber-50">
          Pending
        </Badge>
      )
    }
  
    return (
      <Badge variant="destructive" className="rounded-full">
        Suspended
      </Badge>
    )
  }
  
  export default function ProfilePage() {
    const initials = user.name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase()
  
    const permissions = rolePermissions[user.role]
  
    return (
      <div className="space-y-6 text-slate-950">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative p-6 lg:p-8">
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-slate-100 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-blue-50 blur-3xl" />
  
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex size-24 items-center justify-center rounded-3xl border border-slate-200 bg-slate-950 text-3xl font-bold text-white shadow-sm">
                  {initials}
                </div>
  
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="rounded-full border-slate-300 bg-white text-slate-950"
                    >
                      <UserCog className="mr-1 size-3" />
                      {getRoleLabel(user.role)}
                    </Badge>
  
                    {getStatusBadge(user.status)}
                  </div>
  
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                      {user.name}
                    </h1>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      AgentRx account profile and access overview.
                    </p>
                  </div>
                </div>
              </div>
  
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="rounded-xl border-slate-300 bg-white text-slate-950 hover:bg-slate-100 hover:text-slate-950"
                >
                  <LockKeyhole className="mr-2 size-4" />
                  Security Settings
                </Button>
  
                <Button className="rounded-xl bg-slate-950 text-white hover:bg-slate-800">
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </section>
  
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ProfileMetric
            title="Role"
            value={getRoleLabel(user.role)}
            description="Current access level"
            icon={ShieldCheck}
          />
  
          <ProfileMetric
            title="Department"
            value={user.department}
            description="Assigned workspace"
            icon={Pill}
          />
  
          <ProfileMetric
            title="Last login"
            value={user.lastLogin}
            description="Recent account activity"
            icon={Activity}
          />
  
          <ProfileMetric
            title="Member since"
            value={user.joinedAt}
            description="Account creation date"
            icon={CalendarClock}
          />
        </section>
  
        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-3xl border-slate-200 bg-white text-slate-950 shadow-sm">
            <CardHeader className="border-b border-slate-200 bg-slate-50/80">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950">
                <User className="size-5 text-slate-800" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-sm font-medium text-slate-700">
                Basic identity and professional account details.
              </CardDescription>
            </CardHeader>
  
            <CardContent className="space-y-4 p-6">
              <InfoRow
                icon={Mail}
                label="Email address"
                value={user.email}
              />
  
              <InfoRow
                icon={BadgeCheck}
                label="License number"
                value={user.licenseNumber ?? "Not provided"}
              />
  
              <InfoRow
                icon={MapPin}
                label="Location"
                value={user.location}
              />
  
              <InfoRow
                icon={Stethoscope}
                label="Department"
                value={user.department}
              />
            </CardContent>
          </Card>
  
          <Card className="rounded-3xl border-slate-200 bg-white text-slate-950 shadow-sm">
            <CardHeader className="border-b border-slate-200 bg-slate-50/80">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950">
                <ShieldCheck className="size-5 text-slate-800" />
                Access Permissions
              </CardTitle>
              <CardDescription className="text-sm font-medium text-slate-700">
                Permissions are based on whether the user is an admin,
                pharmacist, or staff member.
              </CardDescription>
            </CardHeader>
  
            <CardContent className="grid gap-3 p-6 md:grid-cols-2">
              {permissions.map((permission) => (
                <div
                  key={permission}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="mt-0.5 rounded-xl bg-emerald-50 p-1.5 text-emerald-950">
                    <CheckCircle2 className="size-4" />
                  </div>
  
                  <p className="text-sm font-semibold leading-5 text-slate-950">
                    {permission}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
  
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-3xl border-slate-200 bg-white text-slate-950 shadow-sm">
            <CardHeader className="border-b border-slate-200 bg-slate-50/80">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950">
                <ClipboardCheck className="size-5 text-slate-800" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-sm font-medium text-slate-700">
                Recent actions connected to this user account.
              </CardDescription>
            </CardHeader>
  
            <CardContent className="divide-y divide-slate-200 p-0">
              {activityItems.map((item) => (
                <div key={item.title} className="p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-bold text-slate-950">{item.title}</p>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {item.description}
                      </p>
                    </div>
  
                    <Badge
                      variant="outline"
                      className="w-fit rounded-full border-slate-300 bg-white text-slate-900"
                    >
                      {item.time}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
  
          <Card className="rounded-3xl border-slate-200 bg-white text-slate-950 shadow-sm">
            <CardHeader className="border-b border-slate-200 bg-slate-50/80">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950">
                <LockKeyhole className="size-5 text-slate-800" />
                Security Overview
              </CardTitle>
              <CardDescription className="text-sm font-medium text-slate-700">
                Account protection and access status.
              </CardDescription>
            </CardHeader>
  
            <CardContent className="space-y-3 p-6">
              <SecurityItem label="Account status" value="Verified" />
              <SecurityItem label="Medication password" value="Required" />
              <SecurityItem label="Admin controls" value="Enabled" />
              <SecurityItem label="Audit visibility" value="Enabled" />
            </CardContent>
          </Card>
        </section>
      </div>
    )
  }
  
  type ProfileMetricProps = {
    title: string
    value: string
    description: string
    icon: React.ElementType
  }
  
  function ProfileMetric({
    title,
    value,
    description,
    icon: Icon,
  }: ProfileMetricProps) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-950 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-700">
              {title}
            </p>
  
            <p className="mt-2 truncate text-lg font-bold tracking-tight text-slate-950">
              {value}
            </p>
  
            <p className="mt-1 text-xs font-medium text-slate-700">
              {description}
            </p>
          </div>
  
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900">
            <Icon className="size-5" />
          </div>
        </div>
      </div>
    )
  }
  
  type InfoRowProps = {
    icon: React.ElementType
    label: string
    value: string
  }
  
  function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900">
          <Icon className="size-4" />
        </div>
  
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-700">
            {label}
          </p>
          <p className="mt-1 break-words text-sm font-bold text-slate-950">
            {value}
          </p>
        </div>
      </div>
    )
  }
  
  function SecurityItem({ label, value }: { label: string; value: string }) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <span className="text-sm font-semibold text-slate-800">{label}</span>
  
        <Badge
          variant="outline"
          className="rounded-full border-slate-300 bg-slate-50 text-slate-950"
        >
          {value}
        </Badge>
      </div>
    )
  }