import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";
import { UserFacingError } from "../../../../lib/error";

export const addBias = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBias", {
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

        if (biasExists)
          throw new UserFacingError("that group is already on your bias list!");

        const bias = await ctx.db.bias.create({
          data: { accountId: account.id, groupId: group.id },
        });

        return bias;
      },
    });
  },
});
