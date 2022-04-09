import { extendType, nonNull } from "nexus";

export const GetGroupQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getGroup", {
      type: "Group",
      args: {
        id: nonNull("Int"),
      },
      async resolve(_, args, ctx) {
        return ctx.db.group.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});
