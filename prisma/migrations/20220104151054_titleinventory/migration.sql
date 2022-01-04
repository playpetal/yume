/*
  Warnings:

  - A unique constraint covering the columns `[activeTitleId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "activeTitleId" INTEGER;

-- CreateTable
CREATE TABLE "TitleInventory" (
    "id" SERIAL NOT NULL,
    "titleId" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER,

    CONSTRAINT "TitleInventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_activeTitleId_key" ON "Account"("activeTitleId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_activeTitleId_fkey" FOREIGN KEY ("activeTitleId") REFERENCES "TitleInventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitleInventory" ADD CONSTRAINT "TitleInventory_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "Title"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitleInventory" ADD CONSTRAINT "TitleInventory_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitleInventory" ADD CONSTRAINT "TitleInventory_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
