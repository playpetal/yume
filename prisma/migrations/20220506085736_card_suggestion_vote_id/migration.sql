-- AlterTable
ALTER TABLE "CardSuggestionVote" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "CardSuggestionVote_pkey" PRIMARY KEY ("id");
