import { extendType, nonNull } from "nexus";
import { auth } from "../../../lib/Auth";
import { canClaimPremiumCurrency } from "../../../lib/game";

export const CanClaimPremiumRewards = extendType({
  type: "Query",
  definition(t) {
    t.field("canClaimPremiumRewards", {
      type: nonNull("Int"),
      async resolve(_, __, ctx) {
        const account = await auth(ctx);
        return await canClaimPremiumCurrency(account, ctx);
      },
    });
  },
});
