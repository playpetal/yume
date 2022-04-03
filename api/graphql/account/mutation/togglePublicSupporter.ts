import { extendType, nonNull } from "nexus";
import { auth } from "../../../lib/Auth";
import { FLAGS } from "../../../lib/flags";

export const togglePublicSupporter = extendType({
  type: "Mutation",
  definition(t) {
    t.field("togglePublicSupporter", {
      type: nonNull("Account"),
      async resolve(_, __, ctx) {
        const account = await auth(ctx);

        let flags = (account.flags ^= FLAGS.PUBLIC_SUPPORTER);

        const _account = await ctx.db.account.update({
          where: { id: account.id },
          data: { flags },
        });

        return _account;
      },
    });
  },
});
