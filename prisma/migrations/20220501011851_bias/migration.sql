-- CreateTable
CREATE TABLE "Bias" (
    "accountId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "Bias_pkey" PRIMARY KEY ("accountId","groupId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bias_accountId_groupId_key" ON "Bias"("accountId", "groupId");

-- AddForeignKey
ALTER TABLE "Bias" ADD CONSTRAINT "Bias_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bias" ADD CONSTRAINT "Bias_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
