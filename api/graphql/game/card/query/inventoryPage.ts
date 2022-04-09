import { extendType, nonNull } from "nexus";

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
        tag: "String",
      },
      async resolve(_, { user, group, subgroup, character, tag }, ctx) {
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
            tag: tag
              ? { tag: { equals: tag, mode: "insensitive" } }
              : undefined,
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
