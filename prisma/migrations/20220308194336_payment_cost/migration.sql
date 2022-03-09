/*
  Warnings:

  - You are about to drop the column `paid` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `cost` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Minigame" ALTER COLUMN "lastPremiumClaim" SET DEFAULT '1999-07-27 00:00:00 +00:00';

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "paid",
ADD COLUMN     "cost" INTEGER NOT NULL;
