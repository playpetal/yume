/*
  Warnings:

  - The values [PREMIUM_CURRENCY] on the enum `ProductType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductType_new" AS ENUM ('PAID_CURRENCY');
ALTER TABLE "Product" ALTER COLUMN "type" TYPE "ProductType_new" USING ("type"::text::"ProductType_new");
ALTER TYPE "ProductType" RENAME TO "ProductType_old";
ALTER TYPE "ProductType_new" RENAME TO "ProductType";
DROP TYPE "ProductType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "paidCurrency" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Minigame" ALTER COLUMN "lastPremiumClaim" SET DEFAULT '1999-07-27 00:00:00 +00:00';
