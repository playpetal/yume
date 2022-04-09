import { objectType, nonNull } from "nexus";
import { CardPrefab } from "nexus-prisma";

export const CardPrefabObject = objectType({
  name: CardPrefab.$name,
  description: CardPrefab.$description,
  definition(t) {
    t.field(CardPrefab.id);
    t.field(CardPrefab.groupId);
    t.field("group", {
      type: "Group",
      async resolve(source, _, ctx) {
        if (!source.groupId) return null;
        return ctx.db.group.findFirst({ where: { id: source.groupId } });
      },
    });
    t.field(CardPrefab.subgroupId);
    t.field("subgroup", {
      type: "Subgroup",
      async resolve(source, _, ctx) {
        if (!source.subgroupId) return null;
        return ctx.db.subgroup.findFirst({ where: { id: source.subgroupId } });
      },
    });
    t.field(CardPrefab.characterId);
    t.field("character", {
      type: nonNull("Character"),
      async resolve(source, _, ctx) {
        return (await ctx.db.character.findFirst({
          where: { id: source.characterId },
        }))!;
      },
    });
    t.field(CardPrefab.releaseId);
    t.field("release", {
      type: nonNull("Release"),
      async resolve(source, _, ctx) {
        return (await ctx.db.release.findFirst({
          where: { id: source.releaseId },
        }))!;
      },
    });
    t.field(CardPrefab.maxCards);
    t.field(CardPrefab.rarity);
  },
});
