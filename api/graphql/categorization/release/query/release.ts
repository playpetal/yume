import { extendType, nonNull } from "nexus";

export const ReleaseQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("release", {
      type: "Release",
      args: { id: nonNull("Int") },
      async resolve(_, { id }, ctx) {
        const release = await ctx.db.release.findFirst({ where: { id } });

        return release;
      },
    });
  },
});
