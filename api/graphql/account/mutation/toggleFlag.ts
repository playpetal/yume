import { UserInputError } from "apollo-server";
import { extendType, nonNull } from "nexus";
import { auth } from "../../../lib/Auth";
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
          throw new UserInputError("there is no account by that id");

        const _account = await toggleFlag(flag, targetAccount, ctx);

        return _account;
      },
    });
  },
});
