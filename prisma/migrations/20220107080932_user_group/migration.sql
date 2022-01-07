-- CreateTable
CREATE TABLE "UserGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "UserGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountUserGroup" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "AccountUserGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserGroup_name_key" ON "UserGroup"("name");

-- AddForeignKey
ALTER TABLE "AccountUserGroup" ADD CONSTRAINT "AccountUserGroup_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountUserGroup" ADD CONSTRAINT "AccountUserGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "UserGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
