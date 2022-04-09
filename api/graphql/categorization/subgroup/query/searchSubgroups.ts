import { extendType, list, nonNull } from "nexus";

export const SearchSubgroupsQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("searchSubgroups", {
      type: nonNull(list(nonNull("Subgroup"))),
      args: {
        search: nonNull("String"),
      },
      async resolve(_, args, ctx) {
        return ctx.db.subgroup.findMany({
          where: { name: { contains: args.search, mode: "insensitive" } },
          take: 25,
        });
      },
    });
  },
});
