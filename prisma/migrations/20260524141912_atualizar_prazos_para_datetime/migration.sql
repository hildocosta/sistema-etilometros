/*
  Warnings:

  - The `proximaCalibracao` column on the `Etilometro` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ultimaCalibracao` column on the `Etilometro` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Etilometro" DROP COLUMN "proximaCalibracao",
ADD COLUMN     "proximaCalibracao" TIMESTAMP(3),
DROP COLUMN "ultimaCalibracao",
ADD COLUMN     "ultimaCalibracao" TIMESTAMP(3);
