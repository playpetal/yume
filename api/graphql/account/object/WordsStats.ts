import { objectType, nonNull } from "nexus";

export const WordsStats = objectType({
  name: "Words",
  description: "Words Minigame Statistics",
  definition(t) {
    t.field("accountId", { type: nonNull("Int") });
    t.field("totalWords", { type: nonNull("Int") });
    t.field("totalTime", { type: nonNull("Int") });
    t.field("totalGames", { type: nonNull("Int") });
    t.field("totalCards", { type: nonNull("Int") });
    t.field("totalCurrency", { type: nonNull("Int") });
    t.field("totalPremiumCurrency", { type: nonNull("Int") });
  },
});
