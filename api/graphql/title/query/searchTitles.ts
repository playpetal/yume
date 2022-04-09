import { extendType, nonNull, list } from "nexus";

export const SearchTitlesQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("searchTitles", {
      type: nonNull(list(nonNull("Title"))),
      args: { search: nonNull("String") },
      async resolve(_, args, ctx) {
        return ctx.db.title.findMany({
          where: { title: { contains: args.search, mode: "insensitive" } },
        });
      },
    });
  },
});
