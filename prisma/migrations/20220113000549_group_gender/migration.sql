-- CreateEnum
CREATE TYPE "GroupGender" AS ENUM ('MALE', 'FEMALE', 'COED');

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "gender" "GroupGender";
