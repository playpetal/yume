-- AlterTable
ALTER TABLE "Minigame" ALTER COLUMN "lastPremiumClaim" SET DEFAULT '1999-07-27 00:00:00 +00:00';

-- CreateTable
CREATE TABLE "Words" (
    "accountId" INTEGER NOT NULL,
    "totalGames" INTEGER NOT NULL DEFAULT 0,
    "totalWords" INTEGER NOT NULL DEFAULT 0,
    "totalTime" INTEGER NOT NULL DEFAULT 0,
    "totalCurrency" INTEGER NOT NULL DEFAULT 0,
    "totalPremiumCurrency" INTEGER NOT NULL DEFAULT 0,
    "totalCards" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Words_pkey" PRIMARY KEY ("accountId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Words_accountId_key" ON "Words"("accountId");

-- AddForeignKey
ALTER TABLE "Words" ADD CONSTRAINT "Words_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
