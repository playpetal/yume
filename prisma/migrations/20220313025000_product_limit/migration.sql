-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProductType" ADD VALUE 'ALPHA_TITLE';
ALTER TYPE "ProductType" ADD VALUE 'BETA_TITLE';
ALTER TYPE "ProductType" ADD VALUE 'SIGMA_TITLE';

-- AlterTable
ALTER TABLE "Minigame" ALTER COLUMN "lastPremiumClaim" SET DEFAULT '1999-07-27 00:00:00 +00:00';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "limit" INTEGER;
