import { objectType, nonNull } from "nexus";
import { Card } from "nexus-prisma";

export const CardObject = objectType({
  name: Card.$name,
  description: Card.$description,
  definition(t) {
    t.field(Card.id);
    t.field(Card.prefabId);
    t.field("owner", {
      type: "Account",
      async resolve(root, _, ctx) {
        if (!root.ownerId) return null;

        return ctx.db.account.findUnique({ where: { id: root.ownerId } });
      },
    });
    t.field(Card.ownerId);
    t.field(Card.issue);
    t.field(Card.quality);
    t.field(Card.tint);
    t.field(Card.createdAt);
    t.field("prefab", {
      type: nonNull("CardPrefab"),
      async resolve(src, _, ctx) {
        return (await ctx.db.cardPrefab.findFirst({
          where: { id: src.prefabId },
        }))!;
      },
    });
    t.field(Card.hasFrame);

    t.field(Card.tagId);
    t.field("tag", {
      type: "Tag",
      async resolve(source, _, ctx) {
        if (!source.tagId) return null;

        const tag = await ctx.db.tag.findFirst({ where: { id: source.tagId } });

        if (tag && tag.accountId !== source.ownerId) {
          await ctx.db.card.update({
            where: { id: source.id },
            data: { tagId: null },
          });
          return null;
        }

        return tag;
      },
    });
  },
});
