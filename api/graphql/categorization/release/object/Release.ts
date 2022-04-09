import { objectType, nonNull, list } from "nexus";
import { Release } from "nexus-prisma";

export const ReleaseObject = objectType({
  name: Release.$name,
  description: Release.$description,
  definition(t) {
    t.field(Release.id);
    t.field(Release.droppable);
    t.field("cards", {
      type: nonNull(list(nonNull("CardPrefab"))),
      async resolve(source, _, ctx) {
        return ctx.db.cardPrefab.findMany({ where: { releaseId: source.id } });
      },
    });
  },
});
