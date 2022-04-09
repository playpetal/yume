import { extendType, list, nonNull } from "nexus";

export const SearchGroupsQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("searchGroups", {
      type: nonNull(list(nonNull("Group"))),
      args: {
        search: nonNull("String"),
      },
      async resolve(_, args, ctx) {
        return ctx.db.group.findMany({
          where: {
            OR: [
              { name: { contains: args.search, mode: "insensitive" } },
              {
                aliases: {
                  some: {
                    alias: { contains: args.search, mode: "insensitive" },
                  },
                },
              },
            ],
          },
          take: 25,
        });
      },
    });
  },
});
