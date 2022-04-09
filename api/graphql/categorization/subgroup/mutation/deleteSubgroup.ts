import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";

export const DeleteSubgroupMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteSubgroup", {
      type: nonNull("Int"),
      args: { id: nonNull("Int") },
      async resolve(_, args, ctx) {
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const subgroup = await ctx.db.subgroup.delete({ where: args });

        return subgroup.id;
      },
    });
  },
});
