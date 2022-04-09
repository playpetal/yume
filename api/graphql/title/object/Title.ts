import { objectType, nonNull, list } from "nexus";
import { Title } from "nexus-prisma";

export const TitleObject = objectType({
  name: Title.$name,
  description: Title.$description,
  definition(t) {
    t.field(Title.id);
    t.field(Title.title);
    t.field(Title.description);
    t.field("inventory", {
      type: nonNull(list(nonNull("TitleInventory"))),
      resolve(root, _, ctx) {
        return ctx.db.titleInventory.findMany({ where: { titleId: root.id } });
      },
    });
    t.field("ownedCount", {
      type: nonNull("Int"),
      resolve(root, _, ctx) {
        return ctx.db.titleInventory.count({ where: { titleId: root.id } });
      },
    });
  },
});
