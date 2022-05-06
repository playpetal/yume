import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";
import { UserFacingError } from "../../../../lib/error";

export const voteCardSuggestion = extendType({
  type: "Mutation",
  definition(t) {
    t.field("voteCardSuggestion", {
      type: nonNull("CardSuggestionVote"),
      args: { suggestionId: nonNull("Int") },
      async resolve(_, { suggestionId }, ctx) {
        const account = await auth(ctx);

        const voteExists = await ctx.db.cardSuggestionVote.findFirst({
          where: { suggestionId, accountId: account.id },
        });

        if (voteExists)
          throw new UserFacingError("you already voted for that suggestion!");

        const vote = await ctx.db.cardSuggestionVote.create({
          data: { suggestionId, accountId: account.id },
        });

        return vote;
      },
    });
  },
});
