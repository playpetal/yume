import { extendType, nonNull } from "nexus";
import { auth } from "../../../lib/Auth";

export const GrantTitle = extendType({
  type: "Mutation",
  definition(t) {
    t.field("grantTitle", {
      type: nonNull("TitleInventory"),
      args: { accountId: nonNull("Int"), titleId: nonNull("Int") },
      async resolve(_, { accountId, titleId }, ctx) {
        await auth(ctx, { requiredFlags: ["DEVELOPER"] });

        return await ctx.db.titleInventory.create({
          data: { accountId: accountId, titleId },
        });
      },
    });
  },
});
