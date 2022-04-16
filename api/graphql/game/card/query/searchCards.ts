import { Quality } from "@prisma/client";
import { extendType, nonNull, list } from "nexus";

export const SearchCardsQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("searchCards", {
      type: nonNull(list(nonNull("Card"))),
      args: {
        search: nonNull("String"),
        ownerId: nonNull("Int"),
        prefabId: "Int",
        maxQuality: "Quality",
        minQuality: "Quality",
        exclude: "Int",
      },
      async resolve(
        _,
        { search, ownerId, prefabId, maxQuality, minQuality, exclude },
        ctx
      ) {
        let qualityFilter: Quality[] | undefined = undefined;

        if (maxQuality || minQuality) {
          let qualities: Quality[] = [
            "SEED",
            "SPROUT",
            "BLOOM",
            "FLOWER",
            "BLOOM",
          ];

          let maxIndex: number = 5;
          let minIndex: number = 0;

          if (maxQuality) maxIndex = qualities.indexOf(maxQuality) + 1;
          if (minQuality) minIndex = qualities.indexOf(minQuality);

          qualityFilter = qualities.slice(minIndex, maxIndex);
        }

        const cards = await ctx.db.card.findMany({
          where: {
            ownerId,
            prefabId: prefabId ?? undefined,
            quality: qualityFilter ? { in: qualityFilter } : undefined,
            id: exclude ? { not: exclude } : undefined,
          },
          include: {
            prefab: {
              include: { character: true, group: true, subgroup: true },
            },
          },
          orderBy: { updatedAt: "desc" },
        });

        const matches = cards.filter(
          (c) =>
            c.id.toString(16).includes(search) ||
            c.prefab.character.name.toLowerCase().includes(search) ||
            c.prefab.group?.name.toLowerCase().includes(search) ||
            c.prefab.subgroup?.name.toLowerCase().includes(search)
        );

        return matches.slice(0, 25);
      },
    });
  },
});
