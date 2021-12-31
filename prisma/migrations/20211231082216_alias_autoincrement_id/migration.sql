-- AlterTable
ALTER TABLE "Alias" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Alias_pkey" PRIMARY KEY ("id");
