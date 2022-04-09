import { Card } from "@prisma/client";
import { extendType, nonNull, list } from "nexus";
import { auth } from "../../../lib/Auth";
import { InvalidInputError } from "../../../lib/error";

export const Gift = extendType({
  type: "Mutation",
  definition(t) {
    t.field("gift", {
      type: nonNull("Boolean"),
      args: {
        recipientId: nonNull("Int"),
        cardIds: list(nonNull("Int")),
        petals: "Int",
        lilies: "Int",
      },
      async resolve(_, { recipientId, cardIds, petals, lilies }, ctx) {
        const account = await auth(ctx);
        const recipient = await ctx.db.account.findFirst({
          where: { id: recipientId },
        });

        if (!recipient)
          throw new InvalidInputError(`there is no user by that id.`);

        if (lilies) {
          if (account.premiumCurrency < lilies || lilies < 0)
            throw new InvalidInputError(
              "you don't have enough lilies to do that."
            );

          await ctx.db.account.update({
            where: { id: account.id },
            data: { premiumCurrency: { decrement: lilies } },
          });

          await ctx.db.account.update({
            where: { id: recipient.id },
            data: { premiumCurrency: { increment: lilies } },
          });
        }

        if (petals) {
          if (account.currency < petals || petals < 0)
            throw new InvalidInputError(
              "you don't have enough petals to do that."
            );

          await ctx.db.account.update({
            where: { id: account.id },
            data: { currency: { decrement: petals } },
          });

          await ctx.db.account.update({
            where: { id: recipient.id },
            data: { currency: { increment: petals } },
          });
        }

        if (cardIds && cardIds.length > 0) {
          const cards: Card[] = [];

          for (let cardId of cardIds) {
            const card = await ctx.db.card.findFirst({ where: { id: cardId } });

            if (!card)
              throw new InvalidInputError(
                `\`${cardId.toString(16)}\` does not exist.`
              );
            if (card.ownerId !== account.id)
              throw new InvalidInputError(
                `\`${cardId.toString(16)}\` does not belong to you.`
              );

            cards.push(card);
          }

          if (cards.length > 0) {
            await ctx.db.card.updateMany({
              where: { id: { in: cards.map((c) => c.id) } },
              data: { ownerId: recipient.id },
            });
          }
        }

        return true;
      },
    });
  },
});
