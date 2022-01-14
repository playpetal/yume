import { enumType, objectType } from "nexus";
import { Card, CardPrefab, Quality } from "nexus-prisma";

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

export const CardObject = objectType({
  name: Card.$name,
  description: Card.$description,
  definition(t) {
    t.field(Card.id);
    t.field(Card.prefab);
    t.field(Card.owner);
    t.field(Card.issue);
    t.field(Card.quality);
    t.field(Card.tint);
    t.field(Card.createdAt);
  },
});

export const QualityEnum = enumType(Quality);
