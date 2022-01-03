-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "discordId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_discordId_key" ON "Account"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");
