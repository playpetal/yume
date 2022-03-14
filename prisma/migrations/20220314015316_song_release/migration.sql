/*
  Warnings:

  - Added the required column `releaseId` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Minigame" ALTER COLUMN "lastPremiumClaim" SET DEFAULT '1999-07-27 00:00:00 +00:00';

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "releaseId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
