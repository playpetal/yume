import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";

export const DeleteAliasMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteAlias", {
      type: nonNull("Int"),
      args: { id: nonNull("Int") },
      async resolve(_, args, ctx) {
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const alias = await ctx.db.alias.delete({ where: args });

        return alias.id;
      },
    });
  },
});
