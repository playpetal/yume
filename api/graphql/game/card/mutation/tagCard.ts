import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";
import { AuthorizationError, NotFoundError } from "../../../../lib/error";

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

        if (!card) throw new NotFoundError("there are no cards with that id.");

        if (card.ownerId !== account.id)
          throw new AuthorizationError(
            "you are not allowed to perform that action on that card."
          );

        const targetTag = await ctx.db.tag.findFirst({
          where: {
            tag: { equals: tag, mode: "insensitive" },
            accountId: account.id,
          },
        });

        if (!targetTag)
          throw new NotFoundError("you don't have any tags with that name.");

        const _card = await ctx.db.card.update({
          data: { tagId: targetTag.id },
          where: { id: card.id },
        });
        return _card;
      },
    });
  },
});
