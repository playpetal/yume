import { nonNull, objectType } from "nexus";

export const AccountStatsObject = objectType({
  name: "AccountStats",
  description: "Account Stats",
  definition(t) {
    t.field("cardCount", { type: nonNull("Int") });
    t.field("rollCount", { type: nonNull("Int") });
  },
});
