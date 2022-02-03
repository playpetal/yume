import { Quality } from "@prisma/client";
import { enumType, extendType, list, nonNull, objectType } from "nexus";
import { Card, Quality as NexusQuality } from "nexus-prisma";
import { checkAuth } from "../../../lib/Auth";
import { getRandomColor } from "../../../lib/Color";
import { redis } from "../../../lib/redis";

export const CardObject = objectType({
  name: Card.$name,
  description: Card.$description,
  definition(t) {
    t.field(Card.id);
    t.field(Card.prefabId);
    t.field(Card.owner);
    t.field(Card.issue);
    t.field(Card.quality);
    t.field(Card.tint);
    t.field(Card.createdAt);
    t.field("prefab", {
      type: nonNull("CardPrefab"),
      async resolve(src, _, ctx) {
        return (await ctx.db.cardPrefab.findFirst({
          where: { id: src.prefabId },
        }))!;
      },
    });
  },
});

export const RollCardsMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("rollCards", {
      type: nonNull(list(nonNull("Card"))),
      args: {
        gender: "Gender",
        amount: nonNull("Int"),
      },
      async resolve(_, args, ctx) {
        const account = await checkAuth(ctx);

        const cost = (args.gender ? 15 : 10) * args.amount;
        if (account.currency < cost) throw new Error("Not enough currency");

        await ctx.db.account.update({
          where: { id: account.id },
          data: { currency: { decrement: cost } },
        });

        const cards = [];

        while (cards.length < args.amount) {
          const random = Number(Math.random().toFixed(3));
          const quality: Quality = random < 0.875 ? "SEED" : "SPROUT";

          const tint = getRandomColor();

          const cardCount = await ctx.db.cardPrefab.count({
            where: args.gender
              ? { character: { gender: args.gender } }
              : undefined,
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
            where: args.gender
              ? { character: { gender: args.gender } }
              : undefined,
          }))!;

          const issue = await redis.incr(`prefab_issue:${prefab.id}`);

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
      },
    });
  },
});

export const QualityEnum = enumType(NexusQuality);
