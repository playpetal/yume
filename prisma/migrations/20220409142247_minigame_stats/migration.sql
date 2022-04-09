-- CreateEnum
CREATE TYPE "MinigameType" AS ENUM ('GTS', 'GUESS_CHARACTER', 'WORDS');

-- CreateTable
CREATE TABLE "MinigameStats" (
    "accountId" INTEGER NOT NULL,
    "type" "MinigameType" NOT NULL,
    "totalGames" INTEGER NOT NULL DEFAULT 0,
    "totalAttempts" INTEGER NOT NULL DEFAULT 0,
    "totalTime" INTEGER NOT NULL DEFAULT 0,
    "totalCurrency" INTEGER NOT NULL DEFAULT 0,
    "totalPremiumCurrency" INTEGER NOT NULL DEFAULT 0,
    "totalCards" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MinigameStats_pkey" PRIMARY KEY ("accountId")
);

-- CreateIndex
CREATE UNIQUE INDEX "MinigameStats_accountId_key" ON "MinigameStats"("accountId");

-- AddForeignKey
ALTER TABLE "MinigameStats" ADD CONSTRAINT "MinigameStats_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
