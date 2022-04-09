import { extendType, nonNull } from "nexus";

export const GetCardQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getCard", {
      type: "Card",
      args: {
        id: nonNull("Int"),
      },
      async resolve(_, args, ctx) {
        return ctx.db.card.findUnique({ where: { id: args.id } });
      },
    });
  },
});
