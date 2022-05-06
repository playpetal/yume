import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";
import { UserFacingError } from "../../../../lib/error";

export const unfulfillCardSuggestion = extendType({
  type: "Mutation",
  definition(t) {
    t.field("unfulfillCardSuggestion", {
      type: nonNull("CardSuggestion"),
      args: { suggestionId: nonNull("Int") },
      async resolve(_, { suggestionId }, ctx) {
        const account = await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const suggestion = await ctx.db.cardSuggestion.findFirst({
          where: { id: suggestionId },
        });

        if (!suggestion)
          throw new UserFacingError("i couldn't find that suggestion!");

        if (suggestion.managerId !== account.id)
          throw new UserFacingError("that isn't your suggestion to fulfill!");

        if (!suggestion.fulfilled)
          throw new UserFacingError(`that suggestion isn't fulfilled!`);

        const _suggestion = await ctx.db.cardSuggestion.update({
          data: { fulfilled: false },
          where: { id: suggestion.id },
          include: { votes: true },
        });

        return _suggestion;
      },
    });
  },
});
