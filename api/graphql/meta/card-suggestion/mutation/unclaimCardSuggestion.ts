import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";
import { UserFacingError } from "../../../../lib/error";

export const unclaimCardSuggestion = extendType({
  type: "Mutation",
  definition(t) {
    t.field("unclaimCardSuggestion", {
      type: nonNull("CardSuggestion"),
      args: { suggestionId: nonNull("Int") },
      async resolve(_, { suggestionId }, ctx) {
        const account = await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const suggestion = await ctx.db.cardSuggestion.findFirst({
          where: { id: suggestionId },
        });

        if (!suggestion)
          throw new UserFacingError("that suggestion doesn't exist anymore.");

        if (suggestion.managerId !== account.id)
          throw new UserFacingError(`this suggestion isn't assigned to you!`);

        const _suggestion = await ctx.db.cardSuggestion.update({
          data: { managerId: null },
          where: { id: suggestion.id },
          include: { votes: true },
        });

        return _suggestion;
      },
    });
  },
});
