import { CardPrefab, Gender, Quality } from "@prisma/client";
import { Context } from "../../context";
import { checkAuth } from "../Auth";
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
  const account = await checkAuth(ctx);

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

    cards.push(card);
  }

  await ctx.db.rollLog.createMany({
    data: cards.map((c) => {
      return { cardId: c.id, accountId: account.id };
    }),
  });

  return cards;
}
