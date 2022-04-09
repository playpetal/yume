import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";

export const CreateReleaseMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createRelease", {
      type: nonNull("Release"),
      async resolve(_, __, ctx) {
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const release = await ctx.db.release.create({ data: {} });

        return release;
      },
    });
  },
});
