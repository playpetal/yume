import { extendType, nonNull } from "nexus";
import { canClaimRewards } from "../../../lib/game";

export const CanClaimRewards = extendType({
  type: "Query",
  definition(t) {
    t.field("canClaimRewards", {
      type: nonNull("Int"),
      async resolve(_, __, ctx) {
        return await canClaimRewards(ctx);
      },
    });
  },
});
