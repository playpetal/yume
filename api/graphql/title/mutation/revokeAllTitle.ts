import { extendType, nonNull } from "nexus";
import { auth } from "../../../lib/Auth";

export const RevokeAllTitle = extendType({
  type: "Mutation",
  definition(t) {
    t.field("revokeAllTitle", {
      type: nonNull("Int"),
      args: { titleId: nonNull("Int") },
      async resolve(_, { titleId }, ctx) {
        await auth(ctx, { requiredFlags: ["DEVELOPER"] });

        const data = await ctx.db.titleInventory.findMany({
          where: { titleId },
          select: { id: true },
        });

        const ids = data.map(({ id }) => id);

        const { count } = await ctx.db.titleInventory.deleteMany({
          where: { id: { in: ids } },
        });

        return count;
      },
    });
  },
});
