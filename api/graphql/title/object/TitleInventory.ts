import { objectType, nonNull } from "nexus";
import { TitleInventory } from "nexus-prisma";

export const TitleInventoryObject = objectType({
  name: TitleInventory.$name,
  description: TitleInventory.$description,
  definition(t) {
    t.field(TitleInventory.id);
    t.field("title", {
      type: nonNull("Title"),
      async resolve(root, _, ctx) {
        return (await ctx.db.title.findFirst({ where: { id: root.titleId } }))!;
      },
    });
    t.field(TitleInventory.titleId);
    t.field("account", {
      type: nonNull("Account"),
      async resolve(root, _, ctx) {
        return (await ctx.db.account.findFirst({
          where: { id: root.accountId },
        }))!;
      },
    });
    t.field(TitleInventory.accountId);
  },
});
