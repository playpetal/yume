/*
  Warnings:

  - Added the required column `url` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Minigame" ALTER COLUMN "lastPremiumClaim" SET DEFAULT '1999-07-27 00:00:00 +00:00';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "url" TEXT NOT NULL;
