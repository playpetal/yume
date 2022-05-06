/*
  Warnings:

  - Added the required column `privateMessageId` to the `CardSuggestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicMessageId` to the `CardSuggestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CardSuggestion" ADD COLUMN     "privateMessageId" TEXT NOT NULL,
ADD COLUMN     "publicMessageId" TEXT NOT NULL;
