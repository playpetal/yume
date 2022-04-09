import { extendType, nonNull } from "nexus";
import { auth } from "../../../lib/Auth";

export const SetBioMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("setBio", {
      type: nonNull("Account"),
      args: { bio: "String" },
      async resolve(_, args, ctx) {
        const account = await auth(ctx);

        return ctx.db.account.update({
          where: { id: account.id },
          data: { bio: args.bio },
        });
      },
    });
  },
});
