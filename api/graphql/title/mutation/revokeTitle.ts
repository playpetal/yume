import { extendType, nonNull } from "nexus";
import { auth } from "../../../lib/Auth";
import { NotFoundError } from "../../../lib/error";

export const RevokeTitle = extendType({
  type: "Mutation",
  definition(t) {
    t.field("revokeTitle", {
      type: nonNull("Int"),
      args: { accountId: nonNull("Int"), titleId: nonNull("Int") },
      async resolve(_, { accountId, titleId }, ctx) {
        await auth(ctx, { requiredFlags: ["DEVELOPER"] });

        const title = await ctx.db.titleInventory.findFirst({
          where: { accountId, titleId },
        });

        if (!title)
          throw new NotFoundError("that user doesn't have that title.");

        await ctx.db.titleInventory.delete({
          where: { id: title.id },
        });

        return title.id;
      },
    });
  },
});
