/*
  Warnings:

  - You are about to drop the column `aliases` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "aliases";

-- CreateTable
CREATE TABLE "Alias" (
    "groupId" INTEGER NOT NULL,
    "alias" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Alias_groupId_alias_key" ON "Alias"("groupId", "alias");

-- AddForeignKey
ALTER TABLE "Alias" ADD CONSTRAINT "Alias_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
