/*
  Warnings:

  - You are about to drop the `InventoryTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicationInventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicationLot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PrescriptionDispense` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InventoryTransaction" DROP CONSTRAINT "InventoryTransaction_dispenseId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryTransaction" DROP CONSTRAINT "InventoryTransaction_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryTransaction" DROP CONSTRAINT "InventoryTransaction_lotId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryTransaction" DROP CONSTRAINT "InventoryTransaction_medicationId_fkey";

-- DropForeignKey
ALTER TABLE "MedicationInventory" DROP CONSTRAINT "MedicationInventory_medicationId_fkey";

-- DropForeignKey
ALTER TABLE "MedicationLot" DROP CONSTRAINT "MedicationLot_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "MedicationLot" DROP CONSTRAINT "MedicationLot_medicationId_fkey";

-- DropForeignKey
ALTER TABLE "PrescriptionDispense" DROP CONSTRAINT "PrescriptionDispense_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "PrescriptionDispense" DROP CONSTRAINT "PrescriptionDispense_lotId_fkey";

-- DropForeignKey
ALTER TABLE "PrescriptionDispense" DROP CONSTRAINT "PrescriptionDispense_medicationId_fkey";

-- DropForeignKey
ALTER TABLE "PrescriptionDispense" DROP CONSTRAINT "PrescriptionDispense_prescriptionId_fkey";

-- DropForeignKey
ALTER TABLE "PrescriptionDispense" DROP CONSTRAINT "PrescriptionDispense_prescriptionMedicationId_fkey";

-- DropTable
DROP TABLE "InventoryTransaction";

-- DropTable
DROP TABLE "MedicationInventory";

-- DropTable
DROP TABLE "MedicationLot";

-- DropTable
DROP TABLE "PrescriptionDispense";

-- DropEnum
DROP TYPE "DispenseStatus";

-- DropEnum
DROP TYPE "InventoryTransactionType";
