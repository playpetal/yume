import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";

export const UpdateReleaseMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateRelease", {
      type: nonNull("Release"),
      args: {
        id: nonNull("Int"),
        droppable: "Boolean",
      },
      async resolve(_, { id, droppable }, ctx) {
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const release = await ctx.db.release.update({
          where: { id },
          data: { droppable: droppable ?? undefined },
        });

        return release;
      },
    });
  },
});
