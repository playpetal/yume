import { extendType, list, nonNull } from "nexus";

export const getBiases = extendType({
  type: "Query",
  definition(t) {
    t.field("getBiases", {
      type: nonNull(list(nonNull("Bias"))),
      args: {
        accountId: nonNull("Int"),
      },
      async resolve(_, { accountId }, ctx) {
        const biases = await ctx.db.bias.findMany({
          where: { accountId: accountId },
        });

        return biases;
      },
    });
  },
});
