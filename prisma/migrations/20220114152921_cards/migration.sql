-- CreateEnum
CREATE TYPE "Quality" AS ENUM ('SEED', 'SPROUT', 'BUD', 'FLOWER', 'BLOOM');

-- CreateTable
CREATE TABLE "CardPrefab" (
    "id" SERIAL NOT NULL,
    "characterId" INTEGER NOT NULL,
    "subgroupId" INTEGER,
    "maxCards" INTEGER NOT NULL DEFAULT 0,
    "rarity" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "CardPrefab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "cardId" INTEGER NOT NULL,
    "ownerId" INTEGER,
    "tint" INTEGER NOT NULL DEFAULT 16755404,
    "issue" INTEGER,
    "quality" "Quality" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CardPrefab" ADD CONSTRAINT "CardPrefab_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardPrefab" ADD CONSTRAINT "CardPrefab_subgroupId_fkey" FOREIGN KEY ("subgroupId") REFERENCES "Subgroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "CardPrefab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
