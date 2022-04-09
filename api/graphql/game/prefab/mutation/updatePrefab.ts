import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";

export const UpdatePrefabMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updatePrefab", {
      type: nonNull("CardPrefab"),
      args: {
        prefabId: nonNull("Int"),
        characterId: "Int",
        subgroupId: "Int",
        groupId: "Int",
        maxCards: "Int",
        rarity: "Int",
        releaseId: "Int",
      },
      async resolve(
        _,
        {
          prefabId,
          characterId,
          subgroupId,
          groupId,
          maxCards,
          rarity,
          releaseId,
        },
        ctx
      ) {
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        return ctx.db.cardPrefab.update({
          where: { id: prefabId },
          data: {
            characterId: characterId ?? undefined,
            subgroupId: subgroupId,
            groupId: groupId,
            maxCards: maxCards ?? undefined,
            rarity: rarity ?? undefined,
            releaseId: releaseId ?? undefined,
          },
        });
      },
    });
  },
});
