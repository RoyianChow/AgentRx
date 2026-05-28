-- CreateEnum
CREATE TYPE "DrugSchedule" AS ENUM ('PRESCRIPTION', 'OTC', 'NAPRA_SCHEDULE_II', 'NAPRA_SCHEDULE_III', 'NARCOTIC', 'CONTROLLED_DRUG', 'TARGETED_SUBSTANCE', 'BIOLOGIC', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "MedicationStatus" AS ENUM ('ACTIVE', 'DISCONTINUED', 'BACKORDERED', 'RECALLED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "StorageRequirement" AS ENUM ('ROOM_TEMPERATURE', 'REFRIGERATED', 'FROZEN', 'PROTECT_FROM_LIGHT', 'CONTROLLED_SUBSTANCE_LOCKED', 'OTHER');

-- CreateEnum
CREATE TYPE "QuantityUnit" AS ENUM ('TABLET', 'CAPSULE', 'ML', 'MG', 'G', 'PATCH', 'VIAL', 'INHALER', 'BOTTLE', 'PACKAGE', 'UNIT');

-- CreateEnum
CREATE TYPE "PrescriptionOrigin" AS ENUM ('PAPER', 'FAX', 'ERX', 'PHONE', 'TRANSFER', 'PHARMACIST_PRESCRIBED', 'OTHER');

-- CreateEnum
CREATE TYPE "PrescriptionPriority" AS ENUM ('ROUTINE', 'URGENT');

-- CreateEnum
CREATE TYPE "DispenseStatus" AS ENUM ('PREPARED', 'VERIFIED', 'RELEASED', 'CANCELLED', 'REVERSED');

-- CreateEnum
CREATE TYPE "InventoryTransactionType" AS ENUM ('RECEIVE', 'DISPENSE', 'ADJUSTMENT', 'RETURN', 'WASTE', 'TRANSFER_IN', 'TRANSFER_OUT', 'RECALL_QUARANTINE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'PHARMACIST', 'ADMIN');

-- CreateEnum
CREATE TYPE "PrescriptionStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'READY_TO_FILL', 'PARTIALLY_FILLED', 'FILLED', 'ON_HOLD', 'CANCELLED', 'EXPIRED', 'TRANSFERRED');

-- CreateEnum
CREATE TYPE "PreferredContactMethod" AS ENUM ('PHONE', 'EMAIL', 'SMS', 'NONE');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "phone" TEXT,
    "email" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "province" TEXT NOT NULL DEFAULT 'ON',
    "postalCode" TEXT,
    "healthCardNumber" TEXT,
    "healthCardVersion" TEXT,
    "insuranceProvider" TEXT,
    "drugPlanId" TEXT,
    "allergies" TEXT,
    "medicalConditions" TEXT,
    "currentMedications" TEXT,
    "preferredPharmacy" TEXT,
    "primaryPhysicianName" TEXT,
    "primaryPhysicianPhone" TEXT,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "emergencyContactRelationship" TEXT,
    "preferredContactMethod" "PreferredContactMethod" NOT NULL DEFAULT 'PHONE',
    "consentToContact" BOOLEAN NOT NULL DEFAULT false,
    "consentToCollectHealthInfo" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" TEXT NOT NULL,
    "din" TEXT,
    "name" TEXT NOT NULL,
    "brandName" TEXT,
    "genericName" TEXT,
    "manufacturer" TEXT,
    "activeIngredients" TEXT[],
    "strength" TEXT,
    "dosage" TEXT,
    "form" TEXT,
    "route" TEXT,
    "description" TEXT,
    "drugSchedule" "DrugSchedule" NOT NULL DEFAULT 'UNKNOWN',
    "status" "MedicationStatus" NOT NULL DEFAULT 'ACTIVE',
    "storageRequirement" "StorageRequirement" NOT NULL DEFAULT 'ROOM_TEMPERATURE',
    "therapeuticClass" TEXT,
    "atcCode" TEXT,
    "upc" TEXT,
    "packageSize" TEXT,
    "packageUnit" "QuantityUnit",
    "isHighAlert" BOOLEAN NOT NULL DEFAULT false,
    "isLookAlikeSoundAlike" BOOLEAN NOT NULL DEFAULT false,
    "requiresCounselling" BOOLEAN NOT NULL DEFAULT false,
    "requiresRefrigeration" BOOLEAN NOT NULL DEFAULT false,
    "controlledSubstance" BOOLEAN NOT NULL DEFAULT false,
    "pharmacistNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicationInventory" (
    "id" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "pharmacyName" TEXT,
    "storageLocation" TEXT,
    "currentStock" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "committedStock" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "reorderLevel" DECIMAL(12,3),
    "reorderQuantity" DECIMAL(12,3),
    "unitOfMeasure" "QuantityUnit" NOT NULL DEFAULT 'UNIT',
    "supplierName" TEXT,
    "supplierSku" TEXT,
    "acquisitionCost" DECIMAL(10,2),
    "usualSellPrice" DECIMAL(10,2),
    "lastCountedAt" TIMESTAMP(3),
    "lastReceivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicationLot" (
    "id" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "inventoryId" TEXT,
    "lotNumber" TEXT,
    "expiryDate" TIMESTAMP(3),
    "quantityOnHand" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "supplierName" TEXT,
    "invoiceNumber" TEXT,
    "receivedAt" TIMESTAMP(3),
    "isQuarantined" BOOLEAN NOT NULL DEFAULT false,
    "quarantineReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationLot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "status" "PrescriptionStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "PrescriptionPriority" NOT NULL DEFAULT 'ROUTINE',
    "origin" "PrescriptionOrigin" NOT NULL DEFAULT 'OTHER',
    "fileKey" TEXT,
    "rxNumber" TEXT,
    "prescriberName" TEXT,
    "prescriberLicenseNumber" TEXT,
    "prescriberPhone" TEXT,
    "prescriberFax" TEXT,
    "prescriberAddress" TEXT,
    "issuedAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "receivedByName" TEXT,
    "transcribedByName" TEXT,
    "notes" TEXT,
    "pharmacistNotes" TEXT,
    "drugRelatedProblems" TEXT,
    "interventionNotes" TEXT,
    "patientCounsellingNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrescriptionMedication" (
    "id" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "prescribedDrugName" TEXT,
    "prescribedStrength" TEXT,
    "prescribedForm" TEXT,
    "prescribedRoute" TEXT,
    "instructions" TEXT,
    "dose" TEXT,
    "frequency" TEXT,
    "route" TEXT,
    "duration" TEXT,
    "quantity" DECIMAL(12,3),
    "quantityUnit" "QuantityUnit",
    "daysSupply" INTEGER,
    "refillsAuthorized" INTEGER,
    "refillsRemaining" INTEGER,
    "substitutionAllowed" BOOLEAN NOT NULL DEFAULT true,
    "noSubstitutionReason" TEXT,
    "indication" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrescriptionMedication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrescriptionDispense" (
    "id" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "prescriptionMedicationId" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "inventoryId" TEXT,
    "lotId" TEXT,
    "status" "DispenseStatus" NOT NULL DEFAULT 'PREPARED',
    "fillNumber" INTEGER NOT NULL DEFAULT 0,
    "dinSnapshot" TEXT,
    "drugNameSnapshot" TEXT,
    "manufacturerSnapshot" TEXT,
    "strengthSnapshot" TEXT,
    "formSnapshot" TEXT,
    "lotNumberSnapshot" TEXT,
    "expiryDateSnapshot" TIMESTAMP(3),
    "dispensedQuantity" DECIMAL(12,3) NOT NULL,
    "quantityUnit" "QuantityUnit",
    "daysSupply" INTEGER,
    "preparedByName" TEXT,
    "checkedByName" TEXT,
    "dispensedByName" TEXT,
    "releasedByName" TEXT,
    "preparedAt" TIMESTAMP(3),
    "checkedAt" TIMESTAMP(3),
    "dispensedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "releasedAt" TIMESTAMP(3),
    "drugCost" DECIMAL(10,2),
    "dispensingFee" DECIMAL(10,2),
    "markup" DECIMAL(10,2),
    "totalPrice" DECIMAL(10,2),
    "patientCounselled" BOOLEAN NOT NULL DEFAULT false,
    "counsellingNotes" TEXT,
    "pickedUpByName" TEXT,
    "pickedUpAt" TIMESTAMP(3),
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrescriptionDispense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryTransaction" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "lotId" TEXT,
    "dispenseId" TEXT,
    "type" "InventoryTransactionType" NOT NULL,
    "quantityChange" DECIMAL(12,3) NOT NULL,
    "balanceAfter" DECIMAL(12,3),
    "reason" TEXT,
    "reference" TEXT,
    "createdByName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "Patient_createdById_idx" ON "Patient"("createdById");

-- CreateIndex
CREATE INDEX "Patient_fullName_idx" ON "Patient"("fullName");

-- CreateIndex
CREATE INDEX "Patient_phone_idx" ON "Patient"("phone");

-- CreateIndex
CREATE INDEX "Patient_email_idx" ON "Patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Medication_din_key" ON "Medication"("din");

-- CreateIndex
CREATE INDEX "Medication_name_idx" ON "Medication"("name");

-- CreateIndex
CREATE INDEX "Medication_brandName_idx" ON "Medication"("brandName");

-- CreateIndex
CREATE INDEX "Medication_genericName_idx" ON "Medication"("genericName");

-- CreateIndex
CREATE INDEX "Medication_din_idx" ON "Medication"("din");

-- CreateIndex
CREATE INDEX "Medication_drugSchedule_idx" ON "Medication"("drugSchedule");

-- CreateIndex
CREATE INDEX "Medication_status_idx" ON "Medication"("status");

-- CreateIndex
CREATE INDEX "MedicationInventory_medicationId_idx" ON "MedicationInventory"("medicationId");

-- CreateIndex
CREATE INDEX "MedicationInventory_currentStock_idx" ON "MedicationInventory"("currentStock");

-- CreateIndex
CREATE INDEX "MedicationInventory_storageLocation_idx" ON "MedicationInventory"("storageLocation");

-- CreateIndex
CREATE INDEX "MedicationLot_medicationId_idx" ON "MedicationLot"("medicationId");

-- CreateIndex
CREATE INDEX "MedicationLot_inventoryId_idx" ON "MedicationLot"("inventoryId");

-- CreateIndex
CREATE INDEX "MedicationLot_lotNumber_idx" ON "MedicationLot"("lotNumber");

-- CreateIndex
CREATE INDEX "MedicationLot_expiryDate_idx" ON "MedicationLot"("expiryDate");

-- CreateIndex
CREATE UNIQUE INDEX "Prescription_rxNumber_key" ON "Prescription"("rxNumber");

-- CreateIndex
CREATE INDEX "Prescription_patientId_idx" ON "Prescription"("patientId");

-- CreateIndex
CREATE INDEX "Prescription_status_idx" ON "Prescription"("status");

-- CreateIndex
CREATE INDEX "Prescription_rxNumber_idx" ON "Prescription"("rxNumber");

-- CreateIndex
CREATE INDEX "Prescription_issuedAt_idx" ON "Prescription"("issuedAt");

-- CreateIndex
CREATE INDEX "Prescription_receivedAt_idx" ON "Prescription"("receivedAt");

-- CreateIndex
CREATE INDEX "PrescriptionMedication_prescriptionId_idx" ON "PrescriptionMedication"("prescriptionId");

-- CreateIndex
CREATE INDEX "PrescriptionMedication_medicationId_idx" ON "PrescriptionMedication"("medicationId");

-- CreateIndex
CREATE INDEX "PrescriptionDispense_prescriptionId_idx" ON "PrescriptionDispense"("prescriptionId");

-- CreateIndex
CREATE INDEX "PrescriptionDispense_prescriptionMedicationId_idx" ON "PrescriptionDispense"("prescriptionMedicationId");

-- CreateIndex
CREATE INDEX "PrescriptionDispense_medicationId_idx" ON "PrescriptionDispense"("medicationId");

-- CreateIndex
CREATE INDEX "PrescriptionDispense_inventoryId_idx" ON "PrescriptionDispense"("inventoryId");

-- CreateIndex
CREATE INDEX "PrescriptionDispense_lotId_idx" ON "PrescriptionDispense"("lotId");

-- CreateIndex
CREATE INDEX "PrescriptionDispense_status_idx" ON "PrescriptionDispense"("status");

-- CreateIndex
CREATE INDEX "PrescriptionDispense_dispensedAt_idx" ON "PrescriptionDispense"("dispensedAt");

-- CreateIndex
CREATE INDEX "InventoryTransaction_inventoryId_idx" ON "InventoryTransaction"("inventoryId");

-- CreateIndex
CREATE INDEX "InventoryTransaction_medicationId_idx" ON "InventoryTransaction"("medicationId");

-- CreateIndex
CREATE INDEX "InventoryTransaction_lotId_idx" ON "InventoryTransaction"("lotId");

-- CreateIndex
CREATE INDEX "InventoryTransaction_dispenseId_idx" ON "InventoryTransaction"("dispenseId");

-- CreateIndex
CREATE INDEX "InventoryTransaction_type_idx" ON "InventoryTransaction"("type");

-- CreateIndex
CREATE INDEX "InventoryTransaction_createdAt_idx" ON "InventoryTransaction"("createdAt");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationInventory" ADD CONSTRAINT "MedicationInventory_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationLot" ADD CONSTRAINT "MedicationLot_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationLot" ADD CONSTRAINT "MedicationLot_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "MedicationInventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionMedication" ADD CONSTRAINT "PrescriptionMedication_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionMedication" ADD CONSTRAINT "PrescriptionMedication_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionDispense" ADD CONSTRAINT "PrescriptionDispense_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionDispense" ADD CONSTRAINT "PrescriptionDispense_prescriptionMedicationId_fkey" FOREIGN KEY ("prescriptionMedicationId") REFERENCES "PrescriptionMedication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionDispense" ADD CONSTRAINT "PrescriptionDispense_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionDispense" ADD CONSTRAINT "PrescriptionDispense_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "MedicationInventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionDispense" ADD CONSTRAINT "PrescriptionDispense_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "MedicationLot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "MedicationInventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "MedicationLot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_dispenseId_fkey" FOREIGN KEY ("dispenseId") REFERENCES "PrescriptionDispense"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentMessage" ADD CONSTRAINT "AgentMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
