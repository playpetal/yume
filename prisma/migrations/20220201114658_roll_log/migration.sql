-- CreateTable
CREATE TABLE "RollLog" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "cardId" INTEGER NOT NULL,
    "gender" "Gender",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RollLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RollLog" ADD CONSTRAINT "RollLog_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RollLog" ADD CONSTRAINT "RollLog_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
