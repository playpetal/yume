import { extendType, nonNull } from "nexus";
import { AuthorizationError, NotFoundError } from "../../../lib/error";
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
          throw new AuthorizationError(
            "you are not allowed to access this mutation."
          );

        const payment = await ctx.db.payment.findFirst({
          where: { paymentId: token },
          include: { product: true },
        });

        if (!payment)
          throw new NotFoundError(
            "transaction not found. if this is in error, please contact us at discord.gg/petal."
          );

        if (payment.success) return true;

        const valid = await validatePayment(token);

        if (!valid)
          throw new AuthorizationError(
            "invalid token. if this is in error, please contact us at discord.gg/petal."
          );

        const count = await ctx.db.payment.count({
          where: {
            productId: payment.productId,
            success: true,
            accountId: payment.accountId,
          },
        });

        if (payment.product.limit && count > payment.product.limit)
          throw new AuthorizationError(
            "you've reached the limit for that product."
          );

        const final = await completePayment(token);

        if (!final)
          throw new AuthorizationError(
            "unable to capture funds. if this is in error, please contact us at discord.gg/petal."
          );

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
