import { AuthenticationError } from "apollo-server";
import { extendType, nonNull } from "nexus";
import { validatePayment, completePayment } from "../../../lib/payment";

export const CompleteTransaction = extendType({
  type: "Mutation",
  definition(t) {
    t.field("completeTransaction", {
      type: nonNull("Boolean"),
      args: {
        token: nonNull("String"),
      },
      async resolve(_, { token }, ctx) {
        const auth = ctx.req.headers.authorization;

        if (auth !== process.env.PAYMENT_SHARED_SECRET)
          throw new AuthenticationError("not allowed");

        const payment = await ctx.db.payment.findFirst({
          where: { paymentId: token },
          include: { product: true },
        });

        if (!payment) throw new AuthenticationError("invalid transaction");

        if (payment.success) throw new AuthenticationError("already processed");

        const valid = await validatePayment(token);

        if (!valid) throw new AuthenticationError("invalid transaction");

        const count = await ctx.db.payment.count({
          where: {
            productId: payment.productId,
            success: true,
            accountId: payment.accountId,
          },
        });

        if (payment.product.limit && count > payment.product.limit)
          throw new AuthenticationError(
            "you've reached the limit for that product"
          );

        const final = await completePayment(token);

        if (!final) throw new AuthenticationError("unable to capture funds");

        await ctx.db.payment.update({
          where: { id: payment.id },
          data: { success: true },
        });

        if (payment.product.type === "PAID_CURRENCY") {
          await ctx.db.account.update({
            where: { id: payment.accountId },
            data: { paidCurrency: { increment: payment.product.amount } },
          });
          return true;
        } else if (payment.product.type === "ALPHA_TITLE") {
          await ctx.db.titleInventory.create({
            data: { accountId: payment.accountId, titleId: 3 },
          });
          return true;
        } else if (payment.product.type === "BETA_TITLE") {
          await ctx.db.titleInventory.create({
            data: { accountId: payment.accountId, titleId: 4 },
          });
        } else if (payment.product.type === "SIGMA_TITLE") {
          await ctx.db.titleInventory.create({
            data: { accountId: payment.accountId, titleId: 5 },
          });
        }

        return true;
      },
    });
  },
});
