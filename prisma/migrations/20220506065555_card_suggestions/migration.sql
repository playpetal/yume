-- CreateTable
CREATE TABLE "CardSuggestion" (
    "id" SERIAL NOT NULL,
    "groupName" TEXT NOT NULL,
    "subgroupName" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL,
    "managerId" INTEGER NOT NULL,
    "fulfilled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CardSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardSuggestionVote" (
    "accountId" INTEGER NOT NULL,
    "suggestionId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CardSuggestionVote_accountId_suggestionId_key" ON "CardSuggestionVote"("accountId", "suggestionId");

-- AddForeignKey
ALTER TABLE "CardSuggestion" ADD CONSTRAINT "CardSuggestion_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardSuggestion" ADD CONSTRAINT "CardSuggestion_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardSuggestionVote" ADD CONSTRAINT "CardSuggestionVote_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardSuggestionVote" ADD CONSTRAINT "CardSuggestionVote_suggestionId_fkey" FOREIGN KEY ("suggestionId") REFERENCES "CardSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
