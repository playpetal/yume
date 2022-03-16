import { Prisma } from "@prisma/client";
import { AuthenticationError, UserInputError } from "apollo-server";
import { enumType, extendType, list, nonNull, objectType } from "nexus";
import { Card, Quality as NexusQuality } from "nexus-prisma";
import { auth } from "../../../lib/Auth";
import { roll } from "../../../lib/card";

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

    t.field(Card.tagId);
    t.field("tag", {
      type: "Tag",
      async resolve(source, _, ctx) {
        if (!source.tagId) return null;

        const tag = await ctx.db.tag.findFirst({ where: { id: source.tagId } });

        if (tag && tag.accountId !== source.ownerId) {
          await ctx.db.card.update({
            where: { id: source.id },
            data: { tagId: null },
          });
          return null;
        }

        return tag;
      },
    });
  },
});

export const mutTagCard = extendType({
  type: "Mutation",
  definition(t) {
    t.field("tagCard", {
      type: nonNull("Card"),
      args: {
        cardId: nonNull("Int"),
        tag: nonNull("String"),
      },
      async resolve(_, { cardId, tag }, ctx) {
        const account = await auth(ctx);

        const card = await ctx.db.card.findFirst({ where: { id: cardId } });

        if (!card) throw new UserInputError("that card does not exist.");

        if (card.ownerId !== account.id)
          throw new AuthenticationError("that card does not belong to you.");

        const targetTag = await ctx.db.tag.findFirst({
          where: {
            tag: { equals: tag, mode: "insensitive" },
            accountId: account.id,
          },
        });

        if (!targetTag)
          throw new UserInputError("you don't have a tag by that name.");

        const _card = await ctx.db.card.update({
          data: { tagId: targetTag.id },
          where: { id: card.id },
        });
        return _card;
      },
    });
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

export const Sort = enumType({
  name: "InventorySort",
  description: "Inventory sorting type",
  members: ["ISSUE", "CODE", "GROUP", "SUBGROUP", "CHARACTER", "STAGE"],
});

export const Order = enumType({
  name: "InventoryOrder",
  description: "Inventory ordering type",
  members: ["ASC", "DESC"],
});

export const Inventory = extendType({
  type: "Query",
  definition(t) {
    t.field("inventory", {
      type: nonNull(list(nonNull("Card"))),
      args: {
        userId: nonNull("Int"),
        group: "String",
        subgroup: "String",
        character: "String",
        page: nonNull("Int"),
        sort: "InventorySort",
        order: "InventoryOrder",
        tag: "String",
      },
      async resolve(
        _,
        { userId, page, character, subgroup, group, sort, order, tag },
        ctx
      ) {
        const orderBy: Prisma.Enumerable<Prisma.CardOrderByWithRelationInput> =
          [];

        if (sort === "ISSUE") {
          orderBy.push({ issue: order === "DESC" ? "desc" : "asc" });
        } else if (sort === "CODE") {
          orderBy.push({ id: order === "DESC" ? "desc" : "asc" });
        } else if (sort === "GROUP") {
          orderBy.push({
            prefab: {
              group: { name: order === "DESC" ? "desc" : "asc" },
            },
          });
        } else if (sort === "SUBGROUP") {
          orderBy.push({
            prefab: {
              subgroup: { name: order === "DESC" ? "desc" : "asc" },
            },
          });
        } else if (sort === "CHARACTER") {
          orderBy.push({
            prefab: {
              character: { name: order === "DESC" ? "desc" : "asc" },
            },
          });
        } else if (sort === "STAGE") {
          orderBy.push({ quality: order === "DESC" ? "desc" : "asc" });
        }

        if (sort !== "CODE") {
          orderBy.push({ id: "desc" });
        }

        const cards = await ctx.db.card.findMany({
          where: {
            ownerId: userId,
            prefab: {
              character: character
                ? { name: { contains: character, mode: "insensitive" } }
                : undefined,
              group: group
                ? { name: { contains: group, mode: "insensitive" } }
                : undefined,
              subgroup: subgroup
                ? { name: { contains: subgroup, mode: "insensitive" } }
                : undefined,
            },
            tag: tag
              ? {
                  tag: { equals: tag, mode: "insensitive" },
                }
              : undefined,
          },
          orderBy,
          skip: page * 10 - 10,
          take: 10,
        });

        return cards;
      },
    });
  },
});

export const InventoryPageObject = objectType({
  name: "InventoryPage",
  definition(t) {
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
        user: nonNull("Int"),
        group: "String",
        subgroup: "String",
        character: "String",
      },
      async resolve(_, { user, group, subgroup, character }, ctx) {
        const total = await ctx.db.card.count({
          where: {
            owner: { id: user },
            prefab: {
              character: character
                ? { name: { contains: character, mode: "insensitive" } }
                : undefined,
              group: group
                ? { name: { contains: group, mode: "insensitive" } }
                : undefined,
              subgroup: subgroup
                ? { name: { contains: subgroup, mode: "insensitive" } }
                : undefined,
            },
          },
        });

        return {
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
          orderBy: { updatedAt: "desc" },
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
      async resolve(_, { amount, gender }, ctx) {
        return await roll(ctx, { amount, gender: gender || undefined });
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
        const account = await auth(ctx);

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
          data: { currency: { increment: tier * 3 } },
        });

        return card.id;
      },
    });
  },
});

export const ChangeCardColor = extendType({
  type: "Mutation",
  definition(t) {
    t.field("changeCardColor", {
      type: nonNull("Card"),
      args: {
        cardId: nonNull("Int"),
        color: nonNull("Int"),
      },
      async resolve(_, { cardId, color }, ctx) {
        const account = await auth(ctx);

        const card = await ctx.db.card.findFirst({ where: { id: cardId } });
        if (!card) throw new UserInputError("card not found");

        if (card.ownerId !== account.id)
          throw new UserInputError("not owner of card");

        if (account.premiumCurrency < 25)
          throw new UserInputError("not enough lilies");

        await ctx.db.account.update({
          where: { id: account.id },
          data: { premiumCurrency: { decrement: 25 } },
        });

        return ctx.db.card.update({
          where: { id: cardId },
          data: { tint: color },
        });
      },
    });
  },
});

export const QualityEnum = enumType(NexusQuality);
