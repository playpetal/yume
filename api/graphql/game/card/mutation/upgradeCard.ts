import { Quality } from "@prisma/client";
import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";
import {
  AuthorizationError,
  MissingResourceError,
  NotFoundError,
  ResourceMaxedError,
} from "../../../../lib/error";

export const upgradeCard = extendType({
  type: "Mutation",
  definition(t) {
    t.field("upgradeCard", {
      type: nonNull("Card"),
      args: {
        cardId: nonNull("Int"),
        fodderCardId: nonNull("Int"),
      },
      async resolve(_, { cardId, fodderCardId }, ctx) {
        const account = await auth(ctx);

        const card = await ctx.db.card.findFirst({
          where: { id: cardId },
        });

        const fodderCard = await ctx.db.card.findFirst({
          where: { id: fodderCardId },
        });

        if (!card)
          throw new NotFoundError(
            "no card was found for the target card id given"
          );

        if (!fodderCard)
          throw new NotFoundError(
            "no card was found for the fodder card id given"
          );

        if (card.ownerId !== account.id)
          throw new AuthorizationError(
            "you are not allowed to upgrade that card."
          );

        if (fodderCard.ownerId !== account.id)
          throw new AuthorizationError(
            "you are not allowed to use that card to upgrade another card."
          );

        if (fodderCard.prefabId !== card.prefabId)
          throw new MissingResourceError(
            "both cards in an upgrade must be the same base card."
          );

        if (card.quality === "BLOOM")
          throw new ResourceMaxedError(
            "that card is already upgraded to the maximum level."
          );

        if (fodderCard.quality !== card.quality)
          throw new MissingResourceError(
            "both cards in an upgrade must be of the same quality."
          );

        const qualities = [
          Quality.SEED,
          Quality.SPROUT,
          Quality.BUD,
          Quality.FLOWER,
          Quality.BLOOM,
        ];

        const nextQuality = qualities[qualities.indexOf(card.quality) + 1];

        await ctx.db.card.update({
          where: { id: fodderCard.id },
          data: { ownerId: null },
        });

        const _card = await ctx.db.card.update({
          where: { id: card.id },
          data: { quality: nextQuality },
        });

        return _card;
      },
    });
  },
});
