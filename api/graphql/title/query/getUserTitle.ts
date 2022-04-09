import { extendType, nonNull } from "nexus";

export const getUserTitle = extendType({
  type: "Query",
  definition(t) {
    t.field("getUserTitle", {
      type: "TitleInventory",
      args: { id: nonNull("Int") },
      async resolve(_, args, ctx) {
        return ctx.db.titleInventory.findUnique({ where: { id: args.id } });
      },
    });
  },
});
