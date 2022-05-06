import { UserInputError } from "apollo-server";
import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";

export const deleteCardSuggestion = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteCardSuggestion", {
      type: nonNull("CardSuggestion"),
      args: {
        id: nonNull("Int"),
      },
      async resolve(_, { id }, ctx) {
        console.log(ctx.req.headers.authorization);
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const suggestion = await ctx.db.cardSuggestion.findFirst({
          where: { id },
          include: { votes: true },
        });

        if (!suggestion)
          throw new UserInputError("that suggestion doesn't exist anymore!");

        const deleteVotes = ctx.db.cardSuggestionVote.deleteMany({
          where: { suggestionId: suggestion.id },
        });

        const deleteSuggestion = ctx.db.cardSuggestion.delete({
          where: { id: suggestion.id },
        });

        await ctx.db.$transaction([deleteVotes, deleteSuggestion]);

        return suggestion;
      },
    });
  },
});
