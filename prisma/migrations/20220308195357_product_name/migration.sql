/*
  Warnings:

  - Added the required column `name` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Minigame" ALTER COLUMN "lastPremiumClaim" SET DEFAULT '1999-07-27 00:00:00 +00:00';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "name" TEXT NOT NULL;
