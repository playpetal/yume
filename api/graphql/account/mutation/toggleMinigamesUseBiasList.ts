import { extendType, nonNull } from "nexus";
import { auth } from "../../../lib/Auth";
import { toggleFlag } from "../../../lib/flags";

export const toggleMinigamesUseBiasList = extendType({
  type: "Mutation",
  definition(t) {
    t.field("toggleMinigamesUseBiasList", {
      type: nonNull("Account"),
      async resolve(_, __, ctx) {
        const account = await auth(ctx);

        const _account = await toggleFlag(
          "MINIGAMES_USE_BIAS_LIST",
          account,
          ctx
        );
        return _account;
      },
    });
  },
});
