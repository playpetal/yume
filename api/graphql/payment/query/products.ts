import { extendType, nonNull, list } from "nexus";

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
