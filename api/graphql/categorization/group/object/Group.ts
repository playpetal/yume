import { objectType, nonNull, list } from "nexus";
import { Group } from "nexus-prisma";

export const GroupObject = objectType({
  name: Group.$name,
  description: Group.$description,
  definition(t) {
    t.field(Group.id);
    t.field(Group.name);
    t.field(Group.creation);
    t.field(Group.gender);
    t.field("aliases", {
      type: nonNull(list(nonNull("Alias"))),
      async resolve(group, __, ctx) {
        const aliases = await ctx.db.alias.findMany({
          where: { groupId: group.id },
        });

        return aliases;
      },
    });
  },
});
