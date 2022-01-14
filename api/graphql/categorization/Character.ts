import { extendType, list, nonNull, objectType } from "nexus";
import { Character } from "nexus-prisma";
import { checkAuth } from "../../lib/Auth";
import { userInGroup } from "../../lib/Permissions";

export const CharacterObject = objectType({
  name: Character.$name,
  description: Character.$description,
  definition(t) {
    t.field(Character.id);
    t.field(Character.name);
    t.field(Character.birthday);
    t.field(Character.gender);
  },
});

export const CreateCharacterMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createCharacter", {
      type: nonNull("Character"),
      args: { name: nonNull("String"), birthday: "DateTime", gender: "Gender" },
      async resolve(_, args, ctx) {
        const account = await checkAuth(ctx);
        await userInGroup(ctx, account.discordId, [
          "Developer",
          "Release Manager",
        ]);

        return ctx.db.character.create({
          data: {
            name: args.name,
            birthday: args.birthday,
            gender: args.gender,
          },
        });
      },
    });
  },
});

export const DeleteCharacterMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteCharacter", {
      type: nonNull("Int"),
      args: { id: nonNull("Int") },
      async resolve(_, args, ctx) {
        const account = await checkAuth(ctx);
        await userInGroup(ctx, account.discordId, [
          "Developer",
          "Release Manager",
        ]);

        await ctx.db.character.delete({ where: { id: args.id } });

        return args.id;
      },
    });
  },
});

export const UpdateCharacterMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateCharacter", {
      type: nonNull("Character"),
      args: {
        id: nonNull("Int"),
        name: "String",
        birthday: "DateTime",
        gender: "Gender",
      },
      async resolve(_, args, ctx) {
        const account = await checkAuth(ctx);
        await userInGroup(ctx, account.discordId, [
          "Developer",
          "Release Manager",
        ]);

        return ctx.db.character.update({
          where: { id: args.id },
          data: {
            name: args.name || undefined,
            birthday: args.birthday,
            gender: args.gender,
          },
        });
      },
    });
  },
});

export const CharactersQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("characters", {
      type: nonNull(list(nonNull("Character"))),
      args: {
        id: "Int",
        name: "String",
        birthday: "DateTime",
        gender: "Gender",
      },
      async resolve(_, args, ctx) {
        return ctx.db.character.findMany({
          where: {
            id: args.id ?? undefined,
            name: args.name ?? undefined,
            birthday: args.birthday ?? undefined,
            gender: args.gender,
          },
        });
      },
    });
  },
});

export const SearchCharactersQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("searchCharacters", {
      type: nonNull(list(nonNull("Character"))),
      args: {
        search: nonNull("String"),
      },
      async resolve(_, args, ctx) {
        return ctx.db.character.findMany({
          where: { name: { contains: args.search, mode: "insensitive" } },
          take: 25,
        });
      },
    });
  },
});
