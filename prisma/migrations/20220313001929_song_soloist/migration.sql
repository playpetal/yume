-- AlterTable
ALTER TABLE "Minigame" ALTER COLUMN "lastPremiumClaim" SET DEFAULT '1999-07-27 00:00:00 +00:00';

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "soloistId" INTEGER;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_soloistId_fkey" FOREIGN KEY ("soloistId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;
