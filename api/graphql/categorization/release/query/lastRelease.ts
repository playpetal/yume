import { extendType } from "nexus";

export const LastReleaseQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("lastRelease", {
      type: "Release",
      async resolve(_, __, ctx) {
        const release = await ctx.db.release.findFirst({
          where: { droppable: false },
          orderBy: { id: "desc" },
        });

        return release;
      },
    });
  },
});
