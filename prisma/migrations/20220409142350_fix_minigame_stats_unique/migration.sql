/*
  Warnings:

  - A unique constraint covering the columns `[accountId,type]` on the table `MinigameStats` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MinigameStats_accountId_key";

-- CreateIndex
CREATE UNIQUE INDEX "MinigameStats_accountId_type_key" ON "MinigameStats"("accountId", "type");
