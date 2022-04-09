import { objectType, nonNull } from "nexus";

export const GTSStats = objectType({
  name: "GTS",
  description: "GTS Statistics",
  definition(t) {
    t.field("accountId", { type: nonNull("Int") });
    t.field("totalGuesses", { type: nonNull("Int") });
    t.field("totalTime", { type: nonNull("Int") });
    t.field("totalGames", { type: nonNull("Int") });
    t.field("totalCards", { type: nonNull("Int") });
    t.field("totalCurrency", { type: nonNull("Int") });
    t.field("totalPremiumCurrency", { type: nonNull("Int") });
  },
});
