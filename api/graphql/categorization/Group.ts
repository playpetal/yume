import { objectType } from "nexus";
import { Group } from "nexus-prisma";

export const GroupObject = objectType({
  name: Group.$name,
  description: Group.$description,
  definition(t) {
    t.field(Group.id);
    t.field(Group.name);
    t.field(Group.creation);
    t.field(Group.aliases);
  },
});
