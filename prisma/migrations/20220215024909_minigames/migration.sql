/*
  Warnings:

  - You are about to drop the column `games` on the `GTS` table. All the data in the column will be lost.
  - You are about to drop the column `lastGame` on the `GTS` table. All the data in the column will be lost.
  - You are about to drop the `GTSLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GTSLog" DROP CONSTRAINT "GTSLog_accountId_fkey";

-- DropForeignKey
ALTER TABLE "GTSLog" DROP CONSTRAINT "GTSLog_songId_fkey";

-- AlterTable
ALTER TABLE "GTS" DROP COLUMN "games",
DROP COLUMN "lastGame";

-- DropTable
DROP TABLE "GTSLog";

-- CreateTable
CREATE TABLE "Minigame" (
    "accountId" INTEGER NOT NULL,
    "claimed" INTEGER NOT NULL DEFAULT 0,
    "lastClaim" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Minigame_pkey" PRIMARY KEY ("accountId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Minigame_accountId_key" ON "Minigame"("accountId");

-- AddForeignKey
ALTER TABLE "Minigame" ADD CONSTRAINT "Minigame_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
