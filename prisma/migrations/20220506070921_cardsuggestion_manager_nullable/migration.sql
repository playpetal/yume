-- DropForeignKey
ALTER TABLE "CardSuggestion" DROP CONSTRAINT "CardSuggestion_managerId_fkey";

-- AlterTable
ALTER TABLE "CardSuggestion" ALTER COLUMN "managerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CardSuggestion" ADD CONSTRAINT "CardSuggestion_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
