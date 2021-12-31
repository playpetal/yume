import { objectType } from "nexus";
import { Subgroup } from "nexus-prisma";

export const SubgroupObject = objectType({
  name: Subgroup.$name,
  description: Subgroup.$description,
  definition(t) {
    t.field(Subgroup.id);
    t.field(Subgroup.name);
    t.field(Subgroup.creation);
  },
});
