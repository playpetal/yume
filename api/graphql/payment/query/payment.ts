import { extendType, nonNull } from "nexus";
import { auth } from "../../../lib/Auth";

export const GetPayment = extendType({
  type: "Query",
  definition(t) {
    t.field("payment", {
      type: "Payment",
      args: {
        paymentId: nonNull("String"),
      },
      async resolve(_, { paymentId }, ctx) {
        const account = await auth(ctx);

        const payment = await ctx.db.payment.findFirst({
          where: { accountId: account.id, paymentId },
        });

        return payment;
      },
    });
  },
});
