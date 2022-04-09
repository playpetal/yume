import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";

export const UpdateGroupMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateGroup", {
      type: nonNull("Group"),
      args: {
        id: nonNull("Int"),
        name: "String",
        creation: "DateTime",
        gender: "GroupGender",
      },
      async resolve(_, args, ctx) {
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const group = await ctx.db.group.update({
          where: { id: args.id },
          data: {
            name: args.name || undefined,
            creation: args.creation,
            gender: args.gender,
          },
        });

        return group;
      },
    });
  },
});
