import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";

export const createPrefab = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createPrefab", {
      type: nonNull("CardPrefab"),
      args: {
        characterId: nonNull("Int"),
        releaseId: "Int",
        subgroupId: "Int",
        groupId: "Int",
        maxCards: "Int",
        rarity: "Int",
      },
      async resolve(_, args, ctx) {
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        let releaseId = args.releaseId;

        if (!releaseId) {
          const lastRelease = await ctx.db.release.findFirst({
            where: { droppable: false },
            orderBy: { id: "desc" },
          });

          if (!lastRelease) {
            const release = await ctx.db.release.create({ data: {} });
            releaseId = release.id;
          } else releaseId = lastRelease.id;
        }

        return ctx.db.cardPrefab.create({
          data: {
            ...args,
            maxCards: args.maxCards ?? undefined,
            rarity: args.rarity ?? undefined,
            releaseId,
          },
        });
      },
    });
  },
});
