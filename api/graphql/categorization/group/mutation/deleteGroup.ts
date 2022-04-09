import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";

export const DeleteGroupMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteGroup", {
      type: nonNull("Int"),
      args: { id: nonNull("Int") },
      async resolve(_, args, ctx) {
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const group = await ctx.db.group.delete({ where: { id: args.id } });

        return group.id;
      },
    });
  },
});
