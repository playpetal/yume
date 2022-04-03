import { extendType, nonNull } from "nexus";
import { auth } from "../../../lib/Auth";
import { toggleFlag } from "../../../lib/flags";

export const togglePublicSupporter = extendType({
  type: "Mutation",
  definition(t) {
    t.field("togglePublicSupporter", {
      type: nonNull("Account"),
      async resolve(_, __, ctx) {
        const account = await auth(ctx);

        const _account = await toggleFlag("PUBLIC_SUPPORTER", account, ctx);
        return _account;
      },
    });
  },
});
