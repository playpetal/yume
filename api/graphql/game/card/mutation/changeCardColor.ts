import { UserInputError } from "apollo-server";
import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";
import { AuthorizationError, NotFoundError } from "../../../../lib/error";

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
        if (!card) throw new NotFoundError("there are no cards with that id.");

        if (card.ownerId !== account.id)
          throw new AuthorizationError(
            "you are not allowed to perform that action on that card."
          );

        if (account.premiumCurrency < 1)
          throw new UserInputError("not enough lilies");

        await ctx.db.account.update({
          where: { id: account.id },
          data: { premiumCurrency: { decrement: 1 } },
        });

        return ctx.db.card.update({
          where: { id: cardId },
          data: { tint: color },
        });
      },
    });
  },
});
