import { extendType, nonNull } from "nexus";
import { auth } from "../../../lib/Auth";

export const GrantAllTitle = extendType({
  type: "Mutation",
  definition(t) {
    t.field("grantAllTitle", {
      type: nonNull("Int"),
      args: { titleId: nonNull("Int") },
      async resolve(_, { titleId }, ctx) {
        await auth(ctx, { requiredFlags: ["DEVELOPER"] });

        const ids = await ctx.db.account.findMany({
          where: { titles: { none: { titleId } } },
          select: { id: true },
        });

        const data = ids.map(({ id }) => {
          return { accountId: id, titleId };
        });

        const { count } = await ctx.db.titleInventory.createMany({ data });

        return count;
      },
    });
  },
});
