import { extendType, nonNull } from "nexus";
import { auth } from "../../../lib/Auth";
import { canClaimRewards } from "../../../lib/game";

export const CanClaimRewards = extendType({
  type: "Query",
  definition(t) {
    t.field("canClaimRewards", {
      type: nonNull("Int"),
      async resolve(_, __, ctx) {
        const account = await auth(ctx);
        return await canClaimRewards(ctx, account);
      },
    });
  },
});
