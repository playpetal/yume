-- AlterTable
ALTER TABLE "Minigame" ADD COLUMN     "lastPremiumClaim" TIMESTAMP(3) NOT NULL DEFAULT '1999-07-27 00:00:00 +00:00',
ADD COLUMN     "premiumClaimed" INTEGER NOT NULL DEFAULT 0;