import { Quality } from "@prisma/client";
import { enumType, extendType, nonNull, objectType } from "nexus";
import { Card, Quality as NexusQuality } from "nexus-prisma";
import { checkAuth } from "../../../lib/Auth";
import { getRandomColor } from "../../../lib/Color";

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

export const RollCardMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("rollCard", {
      type: nonNull("Card"),
      args: {
        gender: "Gender",
      },
      async resolve(_, args, ctx) {
        const account = await checkAuth(ctx);

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

        const card = await ctx.db.card.create({
          data: { prefabId: prefab.id, quality, tint, ownerId: account.id },
        });

        return card;
      },
    });
  },
});

export const QualityEnum = enumType(NexusQuality);
