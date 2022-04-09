import { UserInputError, AuthenticationError } from "apollo-server";
import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";

export const mutTagCard = extendType({
  type: "Mutation",
  definition(t) {
    t.field("tagCard", {
      type: nonNull("Card"),
      args: {
        cardId: nonNull("Int"),
        tag: nonNull("String"),
      },
      async resolve(_, { cardId, tag }, ctx) {
        const account = await auth(ctx);

        const card = await ctx.db.card.findFirst({ where: { id: cardId } });

        if (!card) throw new UserInputError("that card does not exist.");

        if (card.ownerId !== account.id)
          throw new AuthenticationError("that card does not belong to you.");

        const targetTag = await ctx.db.tag.findFirst({
          where: {
            tag: { equals: tag, mode: "insensitive" },
            accountId: account.id,
          },
        });

        if (!targetTag)
          throw new UserInputError("you don't have a tag by that name.");

        const _card = await ctx.db.card.update({
          data: { tagId: targetTag.id },
          where: { id: card.id },
        });
        return _card;
      },
    });
  },
});
