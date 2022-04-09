import { extendType, list, nonNull } from "nexus";

export const AliasesQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("aliases", {
      type: nonNull(list(nonNull("Alias"))),
      args: { id: "Int", groupId: "Int", alias: "String" },
      async resolve(_, args, ctx) {
        const aliases = await ctx.db.alias.findMany({
          where: {
            id: args.id ?? undefined,
            groupId: args.groupId ?? undefined,
            alias: args.alias ?? undefined,
          },
        });

        return aliases;
      },
    });
  },
});
