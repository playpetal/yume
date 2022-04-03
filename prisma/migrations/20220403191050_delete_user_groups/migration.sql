/*
  Warnings:

  - You are about to drop the `AccountUserGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AccountUserGroup" DROP CONSTRAINT "AccountUserGroup_accountId_fkey";

-- DropForeignKey
ALTER TABLE "AccountUserGroup" DROP CONSTRAINT "AccountUserGroup_groupId_fkey";

-- DropTable
DROP TABLE "AccountUserGroup";

-- DropTable
DROP TABLE "UserGroup";
