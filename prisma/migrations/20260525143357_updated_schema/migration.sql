/*
  Warnings:

  - You are about to drop the column `activeIngredients` on the `Medication` table. All the data in the column will be lost.
  - You are about to drop the column `atcCode` on the `Medication` table. All the data in the column will be lost.
  - You are about to drop the column `packageSize` on the `Medication` table. All the data in the column will be lost.
  - You are about to drop the column `packageUnit` on the `Medication` table. All the data in the column will be lost.
  - You are about to drop the column `therapeuticClass` on the `Medication` table. All the data in the column will be lost.
  - You are about to drop the column `upc` on the `Medication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Medication" DROP COLUMN "activeIngredients",
DROP COLUMN "atcCode",
DROP COLUMN "packageSize",
DROP COLUMN "packageUnit",
DROP COLUMN "therapeuticClass",
DROP COLUMN "upc",
ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "lotNumber" TEXT,
ADD COLUMN     "reorderLevel" DECIMAL(12,3),
ADD COLUMN     "stockQuantity" DECIMAL(12,3) DEFAULT 0,
ADD COLUMN     "storageLocation" TEXT,
ADD COLUMN     "unitOfMeasure" "QuantityUnit" NOT NULL DEFAULT 'UNIT';
