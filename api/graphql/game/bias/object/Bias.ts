import { nonNull, objectType } from "nexus";
import { Bias } from "nexus-prisma";

export const BiasObject = objectType({
  name: Bias.$name,
  description: Bias.$description,
  definition(t) {
    t.field("account", {
      type: nonNull("Account"),
      async resolve(source, _, ctx) {
        const account = await ctx.db.account.findFirst({
          where: { id: source.accountId },
        });

        return account!;
      },
    });
    t.field(Bias.accountId);

    t.field("group", {
      type: nonNull("Group"),
      async resolve(source, _, ctx) {
        const group = await ctx.db.group.findFirst({
          where: { id: source.groupId },
        });

        return group!;
      },
    });
    t.field(Bias.groupId);
  },
});
