import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";
import { UserFacingError } from "../../../../lib/error";

export const createCardSuggestion = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createCardSuggestion", {
      type: nonNull("CardSuggestion"),
      args: {
        groupName: nonNull("String"),
        subgroupName: nonNull("String"),
        publicMessageId: nonNull("String"),
        privateMessageId: nonNull("String"),
      },
      async resolve(
        _,
        { groupName, subgroupName, publicMessageId, privateMessageId },
        ctx
      ) {
        const account = await auth(ctx);

        const suggestionExists = await ctx.db.cardSuggestion.findFirst({
          where: { groupName, subgroupName },
        });

        if (suggestionExists)
          throw new UserFacingError(
            "**that group has already been suggested!**\nyou can vote it up in %C instead of submitting a new one."
          );

        const suggestion = await ctx.db.cardSuggestion.create({
          data: {
            groupName,
            subgroupName,
            accountId: account.id,
            publicMessageId,
            privateMessageId,
          },
        });

        await ctx.db.cardSuggestionVote.create({
          data: { suggestionId: suggestion.id, accountId: account.id },
        });

        return suggestion;
      },
    });
  },
});
