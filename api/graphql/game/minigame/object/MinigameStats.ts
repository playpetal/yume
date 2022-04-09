import { nonNull, objectType } from "nexus";
import { MinigameStats } from "nexus-prisma";

export const minigameStats = objectType({
  name: MinigameStats.$name,
  description: MinigameStats.$description,
  definition(t) {
    t.field(MinigameStats.accountId);
    t.field("account", {
      type: nonNull("Account"),
      async resolve(source, _, ctx) {
        const account = await ctx.db.account.findFirst({
          where: { id: source.accountId },
        });

        return account!;
      },
    });

    t.field(MinigameStats.type);
    t.field(MinigameStats.totalAttempts);
    t.field(MinigameStats.totalCards);
    t.field(MinigameStats.totalCurrency);
    t.field(MinigameStats.totalGames);
    t.field(MinigameStats.totalPremiumCurrency);
    t.field(MinigameStats.totalTime);
  },
});
