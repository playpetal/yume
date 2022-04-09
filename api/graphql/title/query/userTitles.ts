import { extendType, nonNull, list } from "nexus";

export const UserTitlesQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("userTitles", {
      type: nonNull(list(nonNull("TitleInventory"))),
      args: { accountId: nonNull("Int"), search: "String" },
      async resolve(_, args, ctx) {
        return ctx.db.titleInventory.findMany({
          where: {
            accountId: args.accountId,
            title: { title: { contains: args.search ?? undefined } },
          },
        });
      },
    });
  },
});
