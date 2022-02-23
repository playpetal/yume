/*
  Warnings:

  - You are about to drop the column `totalRewards` on the `GTS` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GTS" DROP COLUMN "totalRewards",
ADD COLUMN     "totalCards" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalCurrency" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "totalGuesses" SET DEFAULT 0,
ALTER COLUMN "totalTime" SET DEFAULT 0,
ALTER COLUMN "totalGames" SET DEFAULT 0;
