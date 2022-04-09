import { objectType, nonNull } from "nexus";
import { Alias } from "nexus-prisma";

export const AliasObject = objectType({
  name: Alias.$name,
  description: Alias.$description,
  definition(t) {
    t.field(Alias.id);
    t.field(Alias.groupId);
    t.field("group", {
      type: nonNull("Group"),
      async resolve(alias, _, ctx) {
        const group = await ctx.db.group.findFirst({
          where: { id: alias.groupId },
        });

        return group!;
      },
    });
    t.field(Alias.alias);
  },
});
