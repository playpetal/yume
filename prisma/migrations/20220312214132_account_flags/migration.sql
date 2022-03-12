-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "flags" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Minigame" ALTER COLUMN "lastPremiumClaim" SET DEFAULT '1999-07-27 00:00:00 +00:00';
