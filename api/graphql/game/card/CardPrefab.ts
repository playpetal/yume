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
      },
      async resolve(_, args, ctx) {
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
          where: { id: args.prefabId },
          data: {
            characterId: args.characterId ?? undefined,
            subgroupId: args.subgroupId,
            groupId: args.groupId,
            maxCards: args.maxCards ?? undefined,
            rarity: args.rarity ?? undefined,
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
