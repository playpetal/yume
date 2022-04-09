import { extendType, nonNull } from "nexus";
import { auth } from "../../../lib/Auth";
import { NotFoundError } from "../../../lib/error";
import { toggleFlag } from "../../../lib/flags";

export const devToggleFlag = extendType({
  type: "Mutation",
  definition(t) {
    t.field("toggleFlag", {
      type: nonNull("Account"),
      args: { accountId: nonNull("Int"), flag: nonNull("Flag") },
      async resolve(_, { accountId, flag }, ctx) {
        await auth(ctx, { requiredFlags: ["DEVELOPER"] });

        const targetAccount = await ctx.db.account.findFirst({
          where: { id: accountId },
        });

        if (!targetAccount)
          throw new NotFoundError("there aren't any accounts with that id.");

        const _account = await toggleFlag(flag, targetAccount, ctx);

        return _account;
      },
    });
  },
});
