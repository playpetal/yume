import { AuthenticationError } from "apollo-server";
import { extendType, list, nonNull, objectType } from "nexus";
import { CardPrefab } from "nexus-prisma";
import { checkAuth } from "../../../lib/Auth";
import { userInGroup } from "../../../lib/Permissions";

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

export const CreatePrefabMutation = extendType({
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
        const account = await checkAuth(ctx);
        const isInGroup = await userInGroup(ctx, account.discordId, [
          "Developer",
          "Release Manager",
        ]);

        if (!isInGroup)
          throw new AuthenticationError(
            "you don't have permission to do that."
          );

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

export const GetPrefab = extendType({
  type: "Query",
  definition(t) {
    t.field("prefab", {
      type: "CardPrefab",
      args: {
        id: nonNull("Int"),
      },
      async resolve(_, args, ctx) {
        return ctx.db.cardPrefab.findUnique({ where: { id: args.id } });
      },
    });
  },
});

export const SearchPrefabsQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("searchPrefabs", {
      type: nonNull(list(nonNull("CardPrefab"))),
      args: {
        search: nonNull("String"),
      },
      async resolve(_, args, ctx) {
        const prefabs = ctx.db.cardPrefab.findMany({
          where: {
            OR: [
              {
                character: {
                  name: { contains: args.search, mode: "insensitive" },
                },
              },
              {
                subgroup: {
                  name: { contains: args.search, mode: "insensitive" },
                },
              },
              {
                group: { name: { contains: args.search, mode: "insensitive" } },
              },
            ],
          },
          take: 25,
        });

        return prefabs;
      },
    });
  },
});
