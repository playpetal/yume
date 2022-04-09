import { extendType, nonNull } from "nexus";

export const GetPrefab = extendType({
  type: "Query",
  definition(t) {
    t.field("prefab", {
      type: "CardPrefab",
      args: {
        id: nonNull("Int"),
      },
      async resolve(_, args, ctx) {
        return ctx.db.cardPrefab.findUnique({ where: { id: args.id } });
      },
    });
  },
});
