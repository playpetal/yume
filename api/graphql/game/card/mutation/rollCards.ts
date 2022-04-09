import { extendType, nonNull, list } from "nexus";
import { roll } from "../../../../lib/card";

export const RollCardsMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("rollCards", {
      type: nonNull(list(nonNull("Card"))),
      args: {
        gender: "Gender",
        amount: nonNull("Int"),
      },
      async resolve(_, { amount, gender }, ctx) {
        return await roll(ctx, { amount, gender: gender || undefined });
      },
    });
  },
});
