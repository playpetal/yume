import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";

export const CreateSubgroupMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createSubgroup", {
      type: nonNull("Subgroup"),
      args: { name: nonNull("String"), creation: "DateTime" },
      async resolve(_, args, ctx) {
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const subgroup = await ctx.db.subgroup.create({ data: args });

        return subgroup;
      },
    });
  },
});
