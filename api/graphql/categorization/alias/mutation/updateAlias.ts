import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";

export const UpdateAliasMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateAlias", {
      type: nonNull("Alias"),
      args: { id: nonNull("Int"), groupId: "Int", alias: "String" },
      async resolve(_, args, ctx) {
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const alias = await ctx.db.alias.update({
          where: { id: args.id },
          data: {
            groupId: args.groupId || undefined,
            alias: args.alias || undefined,
          },
        });

        return alias;
      },
    });
  },
});
