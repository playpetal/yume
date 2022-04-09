/*
  Warnings:

  - The primary key for the `MinigameStats` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "MinigameStats" DROP CONSTRAINT "MinigameStats_pkey",
ADD CONSTRAINT "MinigameStats_pkey" PRIMARY KEY ("accountId", "type");
