/*
  Warnings:

  - You are about to drop the column `guesses` on the `GTSLog` table. All the data in the column will be lost.
  - You are about to drop the column `reward` on the `GTSLog` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `GTSLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GTSLog" DROP COLUMN "guesses",
DROP COLUMN "reward",
DROP COLUMN "time";

-- CreateTable
CREATE TABLE "GTS" (
    "accountId" INTEGER NOT NULL,
    "totalGuesses" INTEGER NOT NULL,
    "totalTime" INTEGER NOT NULL,
    "totalRewards" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GTS_accountId_key" ON "GTS"("accountId");

-- AddForeignKey
ALTER TABLE "GTS" ADD CONSTRAINT "GTS_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
