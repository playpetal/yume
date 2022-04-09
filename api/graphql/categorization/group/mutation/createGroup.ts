import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";

export const CreateGroupMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createGroup", {
      type: nonNull("Group"),
      args: {
        name: nonNull("String"),
        creation: "DateTime",
        gender: "GroupGender",
      },
      async resolve(_, args, ctx) {
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const group = await ctx.db.group.create({
          data: {
            name: args.name,
            creation: args.creation,
            gender: args.gender,
          },
        });

        return group;
      },
    });
  },
});
