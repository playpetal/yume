import { extendType, nonNull, list } from "nexus";

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
