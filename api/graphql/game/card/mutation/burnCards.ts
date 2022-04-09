import { UserInputError, AuthenticationError } from "apollo-server";
import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";

export const BurnCard = extendType({
  type: "Mutation",
  definition(t) {
    t.field("burnCard", {
      type: nonNull("Int"),
      args: {
        cardId: nonNull("Int"),
      },
      async resolve(_, args, ctx) {
        const account = await auth(ctx);

        const card = await ctx.db.card.findFirst({
          where: { id: args.cardId },
        });

        if (!card)
          throw new UserInputError("The specified card does not exist.");

        if (card.ownerId != account.id)
          throw new AuthenticationError("That card doesn't belong to you.");

        const tier =
          ["SEED", "SPROUT", "BUD", "FLOWER", "BLOOM"].indexOf(card.quality) +
          1;

        await ctx.db.card.update({
          where: { id: card.id },
          data: { ownerId: null },
        });
        await ctx.db.account.update({
          where: { id: account.id },
          data: { currency: { increment: tier * 3 } },
        });

        return card.id;
      },
    });
  },
});
