import { extendType, nonNull } from "nexus";

export const GetSubgroupQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getSubgroup", {
      type: "Subgroup",
      args: { id: nonNull("Int") },
      async resolve(_, args, ctx) {
        return ctx.db.subgroup.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});
