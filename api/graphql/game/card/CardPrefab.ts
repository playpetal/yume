import { extendType, nonNull, objectType } from "nexus";
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

export const CreatePrefabMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createPrefab", {
      type: nonNull("CardPrefab"),
      args: {
        characterId: nonNull("Int"),
        subgroupId: "Int",
        groupId: "Int",
        maxCards: "Int",
        rarity: "Int",
      },
      async resolve(_, args, ctx) {
        return ctx.db.cardPrefab.create({
          data: {
            ...args,
            maxCards: args.maxCards ?? undefined,
            rarity: args.rarity ?? undefined,
          },
        });
      },
    });
  },
});
