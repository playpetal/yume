import { extendType, nonNull } from "nexus";
import { auth } from "../../../lib/Auth";

export const SetUserTitle = extendType({
  type: "Mutation",
  definition(t) {
    t.field("setUserTitle", {
      type: nonNull("Account"),
      args: { id: nonNull("Int") },
      async resolve(_, args, ctx) {
        const account = await auth(ctx);

        return ctx.db.account.update({
          where: { id: account.id },
          data: { activeTitleId: args.id },
        });
      },
    });
  },
});
