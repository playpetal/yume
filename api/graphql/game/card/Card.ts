import { Quality } from "@prisma/client";
import { AuthenticationError, UserInputError } from "apollo-server";
import { enumType, extendType, list, nonNull, objectType } from "nexus";
import { Card, Quality as NexusQuality } from "nexus-prisma";
import { checkAuth } from "../../../lib/Auth";
import { incrementIssue } from "../../../lib/card";
import { getRandomColor } from "../../../lib/Color";

export const CardObject = objectType({
  name: Card.$name,
  description: Card.$description,
  definition(t) {
    t.field(Card.id);
    t.field(Card.prefabId);
    t.field("owner", {
      type: "Account",
      async resolve(root, _, ctx) {
        if (!root.ownerId) return null;

        return ctx.db.account.findUnique({ where: { id: root.ownerId } });
      },
    });
    t.field(Card.ownerId);
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
    t.field(Card.hasFrame);
  },
});

export const GetCardQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getCard", {
      type: "Card",
      args: {
        id: nonNull("Int"),
      },
      async resolve(_, args, ctx) {
        return ctx.db.card.findUnique({ where: { id: args.id } });
      },
    });
  },
});

export const Inventory = extendType({
  type: "Query",
  definition(t) {
    t.field("inventory", {
      type: nonNull(list(nonNull("Card"))),
      args: {
        user: nonNull("Int"),
        next: "Int",
        prev: "Int",
      },
      async resolve(_, { user, next, prev }, ctx) {
        return ctx.db.card.findMany({
          take: 10,
          orderBy: next || prev ? { id: next ? "asc" : "desc" } : undefined,
          where: {
            owner: { id: user },
            id: next ? { gt: next } : prev ? { lt: prev } : undefined,
          },
        });
      },
    });
  },
});

export const InventoryPageObject = objectType({
  name: "InventoryPage",
  definition(t) {
    t.field("current", { type: nonNull("Int") });
    t.field("max", { type: nonNull("Int") });
    t.field("cards", { type: nonNull("Int") });
  },
});

export const InventoryPage = extendType({
  type: "Query",
  definition(t) {
    t.field("inventoryPage", {
      type: nonNull("InventoryPage"),
      args: {
        cursor: nonNull("Int"),
        user: nonNull("Int"),
      },
      async resolve(_, args, ctx) {
        const total = await ctx.db.card.count({
          where: { owner: { id: args.user } },
        });

        const current = await ctx.db.card.count({
          where: { owner: { id: args.user }, id: { lte: args.cursor } },
        });

        return {
          current: Math.floor(current / 10) + 1,
          max: Math.ceil(total / 10),
          cards: total,
        };
      },
    });
  },
});

export const SearchCardsQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("searchCards", {
      type: nonNull(list(nonNull("Card"))),
      args: {
        search: nonNull("String"),
        ownerId: nonNull("Int"),
      },
      async resolve(_, args, ctx) {
        const cards = await ctx.db.card.findMany({
          where: { ownerId: args.ownerId },
          include: {
            prefab: {
              include: { character: true, group: true, subgroup: true },
            },
          },
        });

        const matches = cards.filter(
          (c) =>
            c.id.toString(16).includes(args.search) ||
            c.prefab.character.name.toLowerCase().includes(args.search) ||
            c.prefab.group?.name.toLowerCase().includes(args.search) ||
            c.prefab.subgroup?.name.toLowerCase().includes(args.search)
        );

        return matches.slice(0, 25);
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
            where: {
              release: { droppable: true },
              character: args.gender ? { gender: args.gender } : undefined,
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
              character: args.gender ? { gender: args.gender } : undefined,
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
      },
    });
  },
});

export const BurnCard = extendType({
  type: "Mutation",
  definition(t) {
    t.field("burnCard", {
      type: nonNull("Int"),
      args: {
        cardId: nonNull("Int"),
      },
      async resolve(_, args, ctx) {
        const account = await checkAuth(ctx);

        const card = await ctx.db.card.findFirst({
          where: { id: args.cardId },
        });

        if (!card)
          throw new UserInputError("The specified card does not exist.");

        if (card.ownerId != account.id)
          throw new AuthenticationError("That card doesn't belong to you.");

        const tier =
          ["SEED", "SPROUT", "BUD", "FLOWER", "BLOOM"].indexOf(card.quality) +
          1;

        await ctx.db.card.update({
          where: { id: card.id },
          data: { ownerId: null },
        });
        await ctx.db.account.update({
          where: { id: account.id },
          data: { currency: { increment: tier * 5 } },
        });

        return card.id;
      },
    });
  },
});

export const QualityEnum = enumType(NexusQuality);
