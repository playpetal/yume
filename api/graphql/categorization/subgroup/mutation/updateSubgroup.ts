import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";

export const UpdateSubgroupMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateSubgroup", {
      type: nonNull("Subgroup"),
      args: { id: nonNull("Int"), name: "String", creation: "DateTime" },
      async resolve(_, args, ctx) {
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const subgroup = await ctx.db.subgroup.update({
          where: { id: args.id },
          data: { name: args.name ?? undefined, creation: args.creation },
        });

        return subgroup;
      },
    });
  },
});
