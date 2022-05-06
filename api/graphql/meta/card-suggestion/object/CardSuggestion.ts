import { list, nonNull, objectType } from "nexus";
import { CardSuggestion } from "nexus-prisma";

export const CardSuggestionObject = objectType({
  name: CardSuggestion.$name,
  description: CardSuggestion.$description,
  definition(t) {
    t.field(CardSuggestion.id);

    t.field(CardSuggestion.groupName);
    t.field(CardSuggestion.subgroupName);

    t.field(CardSuggestion.accountId);
    t.field("suggestedBy", {
      type: nonNull("Account"),
      async resolve({ accountId }, _, ctx) {
        const account = await ctx.db.account.findFirst({
          where: { id: accountId },
        });

        return account!;
      },
    });

    t.field(CardSuggestion.managerId);
    t.field("fulfilledBy", {
      type: "Account",
      async resolve({ managerId }, _, ctx) {
        if (!managerId) return null;

        const account = await ctx.db.account.findFirst({
          where: { id: managerId },
        });

        return account;
      },
    });

    t.field(CardSuggestion.fulfilled);

    t.field("votes", {
      type: nonNull(list(nonNull("CardSuggestionVote"))),
      async resolve({ id }, _, ctx) {
        const votes = await ctx.db.cardSuggestionVote.findMany({
          where: { suggestionId: id },
        });

        return votes;
      },
    });

    t.field(CardSuggestion.publicMessageId);
    t.field(CardSuggestion.privateMessageId);
  },
});
