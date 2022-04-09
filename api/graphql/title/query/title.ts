import { extendType } from "nexus";

export const title = extendType({
  type: "Query",
  definition(t) {
    t.field("title", {
      type: "Title",
      args: { id: "Int", title: "String" },
      async resolve(_, { id, title }, ctx) {
        return ctx.db.title.findFirst({
          where: {
            id: id ?? undefined,
            title: title ?? undefined,
          },
        });
      },
    });
  },
});
