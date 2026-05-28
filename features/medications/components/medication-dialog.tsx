"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Edit, Loader2, Plus } from "lucide-react"

import {
  createMedication,
  updateMedication,
} from "@/features/medications/actions/actions"
import { MedicationPasswordDialog } from "@/features/medications/components/medication-password-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import type { MedicationRow } from "@/features/medications/components/medications-client"

type MedicationDialogProps = {
  medication?: MedicationRow
  mode?: "create" | "edit"

  onOptimisticCreate?: (medication: MedicationRow) => void
  onCreateConfirmed?: (tempId: string, medication: MedicationRow) => void
  onCreateFailed?: (tempId: string) => void

  onOptimisticUpdate?: (medication: MedicationRow) => void
  onUpdateFailed?: (previousMedication: MedicationRow) => void
}

const drugScheduleOptions = [
  "PRESCRIPTION",
  "OTC",
  "NAPRA_SCHEDULE_II",
  "NAPRA_SCHEDULE_III",
  "NARCOTIC",
  "CONTROLLED_DRUG",
  "TARGETED_SUBSTANCE",
  "BIOLOGIC",
  "UNKNOWN",
]

const medicationStatusOptions = [
  "ACTIVE",
  "DISCONTINUED",
  "BACKORDERED",
  "RECALLED",
  "ON_HOLD",
]

const storageRequirementOptions = [
  "ROOM_TEMPERATURE",
  "REFRIGERATED",
  "FROZEN",
  "PROTECT_FROM_LIGHT",
  "CONTROLLED_SUBSTANCE_LOCKED",
  "OTHER",
]

const quantityUnitOptions = [
  "TABLET",
  "CAPSULE",
  "ML",
  "MG",
  "G",
  "PATCH",
  "VIAL",
  "INHALER",
  "BOTTLE",
  "PACKAGE",
  "UNIT",
]

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function getString(formData: FormData, key: string, fallback = "") {
  const value = formData.get(key)

  if (typeof value !== "string") {
    return fallback
  }

  return value.trim()
}

function getNullableString(formData: FormData, key: string) {
  const value = getString(formData, key)
  return value.length > 0 ? value : null
}

function getCheckbox(formData: FormData, key: string) {
  return formData.get(key) === "on"
}

function createTempId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `temp-${crypto.randomUUID()}`
  }

  return `temp-${Date.now()}`
}

function buildMedicationRowFromForm(
  formData: FormData,
  id: string
): MedicationRow {
  return {
    id,
    name: getString(formData, "name"),
    din: getNullableString(formData, "din"),
    brandName: getNullableString(formData, "brandName"),
    genericName: getNullableString(formData, "genericName"),
    manufacturer: getNullableString(formData, "manufacturer"),
    strength: getNullableString(formData, "strength"),
    dosage: getNullableString(formData, "dosage"),
    form: getNullableString(formData, "form"),
    route: getNullableString(formData, "route"),
    description: getNullableString(formData, "description"),

    drugSchedule: getString(formData, "drugSchedule", "UNKNOWN"),
    status: getString(formData, "status", "ACTIVE"),
    storageRequirement: getString(
      formData,
      "storageRequirement",
      "ROOM_TEMPERATURE"
    ),

    stockQuantity: getString(formData, "stockQuantity", "0") || "0",
    reorderLevel: getNullableString(formData, "reorderLevel"),
    unitOfMeasure: getString(formData, "unitOfMeasure", "UNIT"),
    storageLocation: getNullableString(formData, "storageLocation"),
    lotNumber: getNullableString(formData, "lotNumber"),
    expiryDate: getNullableString(formData, "expiryDate"),

    isHighAlert: getCheckbox(formData, "isHighAlert"),
    isLookAlikeSoundAlike: getCheckbox(formData, "isLookAlikeSoundAlike"),
    requiresCounselling: getCheckbox(formData, "requiresCounselling"),
    requiresRefrigeration: getCheckbox(formData, "requiresRefrigeration"),
    controlledSubstance: getCheckbox(formData, "controlledSubstance"),

    pharmacistNotes: getNullableString(formData, "pharmacistNotes"),
  }
}

export function MedicationDialog({
  medication,
  mode = "create",
  onOptimisticCreate,
  onCreateConfirmed,
  onCreateFailed,
  onOptimisticUpdate,
  onUpdateFailed,
}: MedicationDialogProps) {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null)

  const [formMedication, setFormMedication] = useState<
    MedicationRow | undefined
  >(medication)
  const [formKey, setFormKey] = useState(0)

  const isEditMode = mode === "edit"

  function handleSubmit(formData: FormData) {
    setMessage("")
    setPasswordError("")
    setPendingFormData(formData)
    setPasswordDialogOpen(true)
  }

  async function confirmMedicationSave(password: string) {
    const formData = pendingFormData

    if (!formData) {
      setPasswordError("Medication form data is missing.")
      return
    }

    setIsSaving(true)
    setPasswordError("")

    if (isEditMode) {
      const medicationToUpdate = formMedication ?? medication

      if (!medicationToUpdate) {
        setPasswordError("Medication data is missing.")
        setIsSaving(false)
        return
      }

      const previousMedication = medicationToUpdate
      const optimisticMedication = buildMedicationRowFromForm(
        formData,
        medicationToUpdate.id
      )

      onOptimisticUpdate?.(optimisticMedication)

      try {
        const result = await updateMedication(
          medicationToUpdate.id,
          formData,
          password
        )

        if (!result.success) {
          onUpdateFailed?.(previousMedication)
          setPasswordError(result.message)
          return
        }

        if (result.medication) {
          onOptimisticUpdate?.(result.medication as MedicationRow)
        }

        setPasswordDialogOpen(false)
        setPendingFormData(null)
        setOpen(false)
        router.refresh()
      } catch (error) {
        console.error("Update medication failed:", error)
        onUpdateFailed?.(previousMedication)
        setPasswordError("Medication could not be updated.")
      } finally {
        setIsSaving(false)
      }

      return
    }

    const tempId = createTempId()
    const optimisticMedication = buildMedicationRowFromForm(formData, tempId)

    onOptimisticCreate?.(optimisticMedication)

    try {
      const result = await createMedication(formData, password)

      if (!result.success) {
        onCreateFailed?.(tempId)
        setPasswordError(result.message)
        return
      }

      if (result.medication) {
        onCreateConfirmed?.(tempId, result.medication as MedicationRow)
      }

      setPasswordDialogOpen(false)
      setPendingFormData(null)
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Create medication failed:", error)
      onCreateFailed?.(tempId)
      setPasswordError("Medication could not be created.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <MedicationPasswordDialog
        open={passwordDialogOpen}
        title={
          isEditMode
            ? "Confirm medication update"
            : "Confirm medication creation"
        }
        description={
          isEditMode
            ? "Enter the medication admin password to update this medication record."
            : "Enter the medication admin password to add this medication record."
        }
        confirmLabel={isEditMode ? "Update medication" : "Add medication"}
        isPending={isSaving}
        error={passwordError}
        onOpenChange={(nextOpen) => {
          if (isSaving) return

          setPasswordDialogOpen(nextOpen)

          if (!nextOpen) {
            setPasswordError("")
            setPendingFormData(null)
          }
        }}
        onConfirm={confirmMedicationSave}
      />

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            setFormMedication(medication)
            setFormKey((current) => current + 1)
          }

          setOpen(nextOpen)

          if (!nextOpen) {
            setMessage("")
            setPasswordError("")

            if (!passwordDialogOpen) {
              setPendingFormData(null)
            }
          }
        }}
      >
        <DialogTrigger asChild>
          {isEditMode ? (
            <Button variant="outline" size="sm" className="rounded-xl">
              <Edit className="size-4" />
              <span className="sr-only">Edit medication</span>
            </Button>
          ) : (
            <Button className="rounded-xl">
              <Plus className="mr-2 size-4" />
              Add Medication
            </Button>
          )}
        </DialogTrigger>

        <DialogContent className="clean-scrollbar max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Update medication" : "Add new medication"}
            </DialogTitle>
            <DialogDescription>
              Add medication identity, DIN, stock, storage, and
              pharmacist-facing safety details.
            </DialogDescription>
          </DialogHeader>

          <form key={formKey} action={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Medication name *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={formMedication?.name ?? ""}
                  placeholder="Atorvastatin"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="din">DIN</Label>
                <Input
                  id="din"
                  name="din"
                  defaultValue={formMedication?.din ?? ""}
                  placeholder="8 digit DIN"
                  maxLength={8}
                  inputMode="numeric"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandName">Brand name</Label>
                <Input
                  id="brandName"
                  name="brandName"
                  defaultValue={formMedication?.brandName ?? ""}
                  placeholder="Lipitor"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genericName">Generic name</Label>
                <Input
                  id="genericName"
                  name="genericName"
                  defaultValue={formMedication?.genericName ?? ""}
                  placeholder="Atorvastatin calcium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  name="manufacturer"
                  defaultValue={formMedication?.manufacturer ?? ""}
                  placeholder="Manufacturer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="strength">Strength</Label>
                <Input
                  id="strength"
                  name="strength"
                  defaultValue={formMedication?.strength ?? ""}
                  placeholder="10 mg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  name="dosage"
                  defaultValue={formMedication?.dosage ?? ""}
                  placeholder="Once daily"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="form">Form</Label>
                <Input
                  id="form"
                  name="form"
                  defaultValue={formMedication?.form ?? ""}
                  placeholder="Tablet, capsule, liquid"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="route">Route</Label>
                <Input
                  id="route"
                  name="route"
                  defaultValue={formMedication?.route ?? ""}
                  placeholder="Oral, topical, inhalation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="drugSchedule">Drug schedule</Label>
                <select
                  id="drugSchedule"
                  name="drugSchedule"
                  defaultValue={formMedication?.drugSchedule ?? "UNKNOWN"}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {drugScheduleOptions.map((option) => (
                    <option key={option} value={option}>
                      {formatLabel(option)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={formMedication?.status ?? "ACTIVE"}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {medicationStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {formatLabel(option)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storageRequirement">
                  Storage requirement
                </Label>
                <select
                  id="storageRequirement"
                  name="storageRequirement"
                  defaultValue={
                    formMedication?.storageRequirement ?? "ROOM_TEMPERATURE"
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {storageRequirementOptions.map((option) => (
                    <option key={option} value={option}>
                      {formatLabel(option)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock quantity</Label>
                <Input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  step="0.001"
                  min="0"
                  defaultValue={formMedication?.stockQuantity ?? "0"}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reorderLevel">Reorder level</Label>
                <Input
                  id="reorderLevel"
                  name="reorderLevel"
                  type="number"
                  step="0.001"
                  min="0"
                  defaultValue={formMedication?.reorderLevel ?? ""}
                  placeholder="10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitOfMeasure">Unit</Label>
                <select
                  id="unitOfMeasure"
                  name="unitOfMeasure"
                  defaultValue={formMedication?.unitOfMeasure ?? "UNIT"}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {quantityUnitOptions.map((option) => (
                    <option key={option} value={option}>
                      {formatLabel(option)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storageLocation">Storage location</Label>
                <Input
                  id="storageLocation"
                  name="storageLocation"
                  defaultValue={formMedication?.storageLocation ?? ""}
                  placeholder="Shelf A3, fridge, narcotic safe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lotNumber">Lot number</Label>
                <Input
                  id="lotNumber"
                  name="lotNumber"
                  defaultValue={formMedication?.lotNumber ?? ""}
                  placeholder="Lot number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  defaultValue={formMedication?.expiryDate ?? ""}
                />
              </div>
            </div>

            <div className="grid gap-3 rounded-2xl border bg-slate-50 p-4 sm:grid-cols-2 dark:bg-slate-950/40">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  name="isHighAlert"
                  defaultChecked={formMedication?.isHighAlert ?? false}
                />
                High-alert medication
              </label>

              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  name="isLookAlikeSoundAlike"
                  defaultChecked={
                    formMedication?.isLookAlikeSoundAlike ?? false
                  }
                />
                Look-alike / sound-alike
              </label>

              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  name="requiresCounselling"
                  defaultChecked={formMedication?.requiresCounselling ?? false}
                />
                Requires counselling
              </label>

              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  name="requiresRefrigeration"
                  defaultChecked={formMedication?.requiresRefrigeration ?? false}
                />
                Requires refrigeration
              </label>

              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  name="controlledSubstance"
                  defaultChecked={formMedication?.controlledSubstance ?? false}
                />
                Controlled substance
              </label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pharmacistNotes">Pharmacist notes</Label>
              <Textarea
                id="pharmacistNotes"
                name="pharmacistNotes"
                defaultValue={formMedication?.pharmacistNotes ?? ""}
                placeholder="Internal pharmacist notes..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={formMedication?.description ?? ""}
                placeholder="General medication description..."
                rows={3}
              />
            </div>

            {message ? (
              <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {message}
              </p>
            ) : null}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                disabled={isSaving}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSaving} className="rounded-xl">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditMode ? (
                  "Continue to Password"
                ) : (
                  "Continue to Password"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}