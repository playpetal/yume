import { nonNull, objectType } from "nexus";
import { CardSuggestionVote } from "nexus-prisma";

export const CardSuggestionVoteObject = objectType({
  name: CardSuggestionVote.$name,
  description: CardSuggestionVote.$description,
  definition(t) {
    t.field(CardSuggestionVote.id);

    t.field(CardSuggestionVote.accountId);
    t.field("account", {
      type: nonNull("Account"),
      async resolve({ accountId }, _, ctx) {
        const account = await ctx.db.account.findFirst({
          where: { id: accountId },
        });

        return account!;
      },
    });

    t.field(CardSuggestionVote.suggestionId);
    t.field("suggestion", {
      type: nonNull("CardSuggestion"),
      async resolve({ suggestionId }, _, ctx) {
        const account = await ctx.db.cardSuggestion.findFirst({
          where: { id: suggestionId },
          include: { votes: true },
        });

        return account!;
      },
    });
  },
});
