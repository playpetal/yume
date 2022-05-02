-- CreateTable
CREATE TABLE "Trivia" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "solution" TEXT NOT NULL,

    CONSTRAINT "Trivia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trivia" ADD CONSTRAINT "Trivia_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
