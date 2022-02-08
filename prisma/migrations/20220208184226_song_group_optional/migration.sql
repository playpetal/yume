-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_groupId_fkey";

-- AlterTable
ALTER TABLE "Song" ALTER COLUMN "groupId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
