import { extendType, nonNull } from "nexus";
import { auth } from "../../../lib/Auth";
import { AuthorizationError, NotFoundError } from "../../../lib/error";
import { createTransaction } from "../../../lib/payment";

export const NewTransaction = extendType({
  type: "Mutation",
  definition(t) {
    t.field("newTransaction", {
      type: nonNull("Payment"),
      args: { productId: nonNull("Int") },
      async resolve(_, { productId }, ctx) {
        const account = await auth(ctx);

        const product = await ctx.db.product.findFirst({
          where: { id: productId },
        });

        if (!product)
          throw new NotFoundError("there are no products with that id.");
        if (!product.available)
          throw new AuthorizationError(
            "you are not authorized to purchase that product."
          );

        const transaction = await createTransaction(product);

        const payment = await ctx.db.payment.create({
          data: {
            accountId: account.id,
            productId: product.id,
            cost: product.price,
            paymentId: transaction.id,
            url: transaction.url,
          },
        });

        return payment;
      },
    });
  },
});
