/*
  Warnings:

  - Added the required column `totalGames` to the `GTS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GTS" ADD COLUMN     "totalGames" INTEGER NOT NULL;
