import { UserInputError } from "apollo-server";
import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";

export const ChangeCardColor = extendType({
  type: "Mutation",
  definition(t) {
    t.field("changeCardColor", {
      type: nonNull("Card"),
      args: {
        cardId: nonNull("Int"),
        color: nonNull("Int"),
      },
      async resolve(_, { cardId, color }, ctx) {
        const account = await auth(ctx);

        const card = await ctx.db.card.findFirst({ where: { id: cardId } });
        if (!card) throw new UserInputError("card not found");

        if (card.ownerId !== account.id)
          throw new UserInputError("not owner of card");

        if (account.premiumCurrency < 25)
          throw new UserInputError("not enough lilies");

        await ctx.db.account.update({
          where: { id: account.id },
          data: { premiumCurrency: { decrement: 25 } },
        });

        return ctx.db.card.update({
          where: { id: cardId },
          data: { tint: color },
        });
      },
    });
  },
});
