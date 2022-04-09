import { extendType, list, nonNull } from "nexus";

export const SearchPrefabsQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("searchPrefabs", {
      type: nonNull(list(nonNull("CardPrefab"))),
      args: {
        search: nonNull("String"),
      },
      async resolve(_, args, ctx) {
        const prefabs = ctx.db.cardPrefab.findMany({
          where: {
            OR: [
              {
                character: {
                  name: { contains: args.search, mode: "insensitive" },
                },
              },
              {
                subgroup: {
                  name: { contains: args.search, mode: "insensitive" },
                },
              },
              {
                group: { name: { contains: args.search, mode: "insensitive" } },
              },
            ],
          },
          take: 25,
        });

        return prefabs;
      },
    });
  },
});
