-- CreateTable
CREATE TABLE "PrefabCollection" (
    "accountId" INTEGER NOT NULL,
    "prefabId" INTEGER NOT NULL,
    "rolled" BOOLEAN NOT NULL DEFAULT false,
    "upgraded" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PrefabCollection_pkey" PRIMARY KEY ("accountId","prefabId")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrefabCollection_accountId_prefabId_key" ON "PrefabCollection"("accountId", "prefabId");

-- AddForeignKey
ALTER TABLE "PrefabCollection" ADD CONSTRAINT "PrefabCollection_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrefabCollection" ADD CONSTRAINT "PrefabCollection_prefabId_fkey" FOREIGN KEY ("prefabId") REFERENCES "CardPrefab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
