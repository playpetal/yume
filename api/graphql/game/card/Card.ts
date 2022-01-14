import { enumType, objectType } from "nexus";
import { Quality, Card } from "nexus-prisma";

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
