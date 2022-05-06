import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";
import { UserFacingError } from "../../../../lib/error";

export const claimCardSuggestion = extendType({
  type: "Mutation",
  definition(t) {
    t.field("claimCardSuggestion", {
      type: nonNull("CardSuggestion"),
      args: { suggestionId: nonNull("Int") },
      async resolve(_, { suggestionId }, ctx) {
        const account = await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const suggestion = await ctx.db.cardSuggestion.findFirst({
          where: { id: suggestionId },
        });

        if (!suggestion)
          throw new UserFacingError("i couldn't find that suggestion!");

        if (suggestion.managerId)
          throw new UserFacingError(
            `${
              suggestion.managerId === account.id
                ? "you've"
                : "someone else has"
            } already claimed that suggestion!`
          );

        const _suggestion = await ctx.db.cardSuggestion.update({
          data: { managerId: account.id },
          where: { id: suggestion.id },
        });

        return _suggestion;
      },
    });
  },
});
