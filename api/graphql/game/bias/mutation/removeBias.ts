import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";
import { UserFacingError } from "../../../../lib/error";

export const removeBias = extendType({
  type: "Mutation",
  definition(t) {
    t.field("removeBias", {
      type: nonNull("Bias"),
      args: {
        groupId: nonNull("Int"),
      },
      async resolve(_, { groupId }, ctx) {
        const account = await auth(ctx);

        const group = await ctx.db.group.findFirst({ where: { id: groupId } });
        if (!group) throw new UserFacingError("there is no group by that id!");

        const biasExists = await ctx.db.bias.findFirst({
          where: { accountId: account.id, groupId: group.id },
        });

        if (!biasExists)
          throw new UserFacingError("that group is not on your bias list!");

        const bias = await ctx.db.bias.delete({
          where: {
            accountId_groupId: { accountId: account.id, groupId: group.id },
          },
        });

        return bias;
      },
    });
  },
});
