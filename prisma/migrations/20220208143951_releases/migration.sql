/*
  Warnings:

  - Added the required column `releaseId` to the `CardPrefab` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CardPrefab" ADD COLUMN     "releaseId" INTEGER;

-- CreateTable
CREATE TABLE "Release" (
    "id" SERIAL NOT NULL,
    "droppable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Release_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Release" (droppable) VALUES (true);
UPDATE "CardPrefab" SET "releaseId"=1;

ALTER TABLE "CardPrefab" ALTER COLUMN "releaseId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "CardPrefab" ADD CONSTRAINT "CardPrefab_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
