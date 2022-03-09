import { AuthenticationError, UserInputError } from "apollo-server";
import { enumType, extendType, list, nonNull, objectType } from "nexus";
import { Payment, Product } from "nexus-prisma";
import { checkAuth } from "../../lib/Auth";
import { createTransaction, validatePayment } from "../../lib/payment";

export const ProductObject = objectType({
  name: Product.$name,
  description: Product.$description,
  definition(t) {
    t.field(Product.id);
    t.field(Product.name);
    t.field(Product.available);
    t.field("type", {
      type: "ProductType",
    });
    t.field(Product.price);
  },
});

export const PaymentObject = objectType({
  name: Payment.$name,
  description: Payment.$description,
  definition(t) {
    t.field(Payment.id);
    t.field(Payment.accountId);
    t.field(Payment.cost);
    t.field(Payment.paymentId);
    t.field(Payment.productId);
    t.field(Payment.success);
    t.field(Payment.url);
  },
});

export const ProductType = enumType({
  name: "ProductType",
  members: ["PAID_CURRENCY"],
});

export const GetPayment = extendType({
  type: "Query",
  definition(t) {
    t.field("payment", {
      type: "Payment",
      args: {
        paymentId: nonNull("String"),
      },
      async resolve(_, { paymentId }, ctx) {
        const account = await checkAuth(ctx);

        const payment = await ctx.db.payment.findFirst({
          where: { accountId: account.id, paymentId },
        });

        return payment;
      },
    });
  },
});

export const GetProducts = extendType({
  type: "Query",
  definition(t) {
    t.field("products", {
      type: nonNull(list(nonNull("Product"))),
      async resolve(_, __, { db }) {
        const products = await db.product.findMany({
          where: { available: true },
        });

        return products;
      },
    });
  },
});

export const NewTransaction = extendType({
  type: "Mutation",
  definition(t) {
    t.field("newTransaction", {
      type: nonNull("Payment"),
      args: { productId: nonNull("Int") },
      async resolve(_, { productId }, ctx) {
        const account = await checkAuth(ctx);

        const product = await ctx.db.product.findFirst({
          where: { id: productId },
        });

        if (!product) throw new UserInputError("invalid product");
        if (!product.available)
          throw new AuthenticationError("product not available");

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
        }

        return true;
      },
    });
  },
});
