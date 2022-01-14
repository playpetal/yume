import { objectType } from "nexus";
import { CardPrefab } from "nexus-prisma";

export const CardPrefabObject = objectType({
  name: CardPrefab.$name,
  description: CardPrefab.$description,
  definition(t) {
    t.field(CardPrefab.id);
    t.field(CardPrefab.group);
    t.field(CardPrefab.subgroup);
    t.field(CardPrefab.character);
    t.field(CardPrefab.maxCards);
    t.field(CardPrefab.rarity);
  },
});
