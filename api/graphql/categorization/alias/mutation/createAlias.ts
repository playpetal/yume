import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";

export const CreateAliasMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createAlias", {
      type: nonNull("Alias"),
      args: {
        groupId: nonNull("Int"),
        alias: nonNull("String"),
      },
      async resolve(_, args, ctx) {
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const alias = await ctx.db.alias.create({ data: args });

        return alias;
      },
    });
  },
});
