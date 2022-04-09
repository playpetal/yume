import { Prisma } from "@prisma/client";
import { extendType, nonNull, list } from "nexus";

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
