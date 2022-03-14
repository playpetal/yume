import { AuthenticationError, UserInputError } from "apollo-server";
import { enumType, extendType, list, nonNull, objectType } from "nexus";
import { Payment, Product } from "nexus-prisma";
import { auth } from "../../lib/Auth";
import {
  completePayment,
  createTransaction,
  validatePayment,
} from "../../lib/payment";

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
  members: ["PAID_CURRENCY", "ALPHA_TITLE", "BETA_TITLE", "SIGMA_TITLE"],
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
        const account = await auth(ctx);

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
        const account = await auth(ctx);

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
