import { UserInputError } from "apollo-server";
import { extendType, nonNull } from "nexus";
import { auth } from "../../../lib/Auth";

export const ReachedPurchaseLimit = extendType({
  type: "Query",
  definition(t) {
    t.field("reachedPurchaseLimit", {
      type: nonNull("Boolean"),
      args: { productId: nonNull("Int") },
      async resolve(_, { productId }, ctx) {
        const account = await auth(ctx);

        const product = await ctx.db.product.findFirst({
          where: { id: productId },
        });

        if (!product) throw new UserInputError("invalid product");

        if (!product.limit) return false;

        const count = await ctx.db.payment.count({
          where: {
            accountId: account.id,
            productId: product.id,
            success: true,
          },
        });

        return count >= product.limit;
      },
    });
  },
});
