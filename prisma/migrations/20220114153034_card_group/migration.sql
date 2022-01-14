-- AlterTable
ALTER TABLE "CardPrefab" ADD COLUMN     "groupId" INTEGER;

-- AddForeignKey
ALTER TABLE "CardPrefab" ADD CONSTRAINT "CardPrefab_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
