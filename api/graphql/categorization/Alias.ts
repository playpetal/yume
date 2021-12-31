import { objectType } from "nexus";
import { Alias } from "nexus-prisma";

export const AliasObject = objectType({
  name: Alias.$name,
  description: Alias.$description,
  definition(t) {
    t.field(Alias.groupId);
    t.field(Alias.alias);
  },
});
