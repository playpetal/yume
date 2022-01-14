/*
  Warnings:

  - You are about to drop the column `cardId` on the `Card` table. All the data in the column will be lost.
  - Added the required column `prefabId` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_cardId_fkey";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "cardId",
ADD COLUMN     "prefabId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_prefabId_fkey" FOREIGN KEY ("prefabId") REFERENCES "CardPrefab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
