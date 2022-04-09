import { CardPrefab, Gender, Quality } from "@prisma/client";
import { Context } from "../../context";
import { createAnnouncement } from "../announcement/createAnnouncement";
import { auth } from "../Auth";
import { getRandomColor } from "../Color";

export async function incrementIssue(
  ctx: Context,
  prefab: CardPrefab
): Promise<number> {
  const { lastIssue } = await ctx.db.cardPrefab.update({
    data: { lastIssue: { increment: 1 } },
    where: { id: prefab.id },
  });
  return lastIssue;
}

export async function roll(
  ctx: Context,
  {
    amount,
    gender,
    free,
  }: {
    amount: number;
    gender?: Gender;
    free?: boolean;
  }
) {
  const account = await auth(ctx);

  if (!free) {
    const cost = (gender ? 15 : 10) * amount;
    if (account.currency < cost) throw new Error("Not enough currency");

    await ctx.db.account.update({
      where: { id: account.id },
      data: { currency: { decrement: cost } },
    });
  }

  const cards = [];

  while (cards.length < amount) {
    const random = Number(Math.random().toFixed(3));
    const quality: Quality = random < 0.875 ? "SEED" : "SPROUT";

    const tint = getRandomColor();

    const cardCount = await ctx.db.cardPrefab.count({
      where: {
        release: { droppable: true },
        character: gender ? { gender: gender } : undefined,
      },
    });
    const skip = Math.round(Math.random() * (cardCount - 1));
    const orderBy = ["id", "characterId", "groupId"][
      Math.floor(Math.random() * 3)
    ];
    const orderDir = ["asc", "desc"][Math.floor(Math.random() * 2)];

    if (cardCount === 0) throw new Error("No cards in set");

    const prefab = (await ctx.db.cardPrefab.findFirst({
      take: 1,
      skip,
      orderBy: { [orderBy]: orderDir },
      where: {
        release: { droppable: true },
        character: gender ? { gender: gender } : undefined,
      },
    }))!;

    const issue = await incrementIssue(ctx, prefab);

    const card = await ctx.db.card.create({
      data: {
        prefabId: prefab.id,
        quality,
        tint,
        ownerId: account.id,
        issue,
      },
    });

    if (prefab.subgroupId) {
      const subgroup = await ctx.db.cardPrefab.findMany({
        where: { subgroupId: prefab.subgroupId },
      });

      const collection = await ctx.db.prefabCollection.findMany({
        where: {
          accountId: account.id,
          prefab: { subgroupId: prefab.subgroupId },
        },
      });

      const rolled = collection.filter((c) => c.rolled === true);
      const remainingCards = subgroup.length - rolled.length;

      if (remainingCards === 1) {
        const missingCard = subgroup.find(
          (c) => !rolled.find((r) => r.prefabId === c.id)
        );

        if (missingCard && missingCard.id === prefab.id) {
          let displayName = "%u";
          let subgroupName = "";

          if (account.activeTitleId) {
            const { title } = (await ctx.db.titleInventory.findFirst({
              where: { id: account.activeTitleId },
              include: { title: true },
            }))!;

            displayName = title.title;
          }

          const prefabData = await ctx.db.cardPrefab.findFirst({
            where: { id: missingCard.id },
            select: {
              group: { select: { name: true } },
              subgroup: { select: { name: true } },
            },
          });

          if (prefabData?.group) subgroupName = `${prefabData.group.name}`;
          if (prefabData?.subgroup)
            subgroupName += ` ${prefabData.subgroup.name}`;

          await createAnnouncement(
            ctx,
            "%u has obtained all %a **%s** cards!",
            {
              "%u": displayName.replace("%u", `**${account.username}**`),
              "%a": subgroup.length,
              "%s": subgroupName.trim() || "an unknown subgroup!",
            }
          );
        }
      }
    }

    await ctx.db.prefabCollection.upsert({
      create: {
        accountId: account.id,
        prefabId: prefab.id,
        rolled: true,
      },
      update: {
        rolled: true,
      },
      where: {
        accountId_prefabId: { accountId: account.id, prefabId: prefab.id },
      },
    });

    cards.push(card);
  }

  await ctx.db.rollLog.createMany({
    data: cards.map((c) => {
      return { cardId: c.id, accountId: account.id };
    }),
  });

  return cards;
}
