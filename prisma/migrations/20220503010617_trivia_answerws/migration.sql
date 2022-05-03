/*
  Warnings:

  - You are about to drop the column `solution` on the `Trivia` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Trivia" DROP COLUMN "solution";

-- CreateTable
CREATE TABLE "TriviaAnswer" (
    "id" SERIAL NOT NULL,
    "triviaId" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,

    CONSTRAINT "TriviaAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TriviaAnswer_triviaId_answer_key" ON "TriviaAnswer"("triviaId", "answer");

-- AddForeignKey
ALTER TABLE "TriviaAnswer" ADD CONSTRAINT "TriviaAnswer_triviaId_fkey" FOREIGN KEY ("triviaId") REFERENCES "Trivia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
