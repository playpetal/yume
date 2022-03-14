import { extendType, list, nonNull, objectType } from "nexus";
import { Character } from "nexus-prisma";
import { auth } from "../../lib/Auth";

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
        await auth(ctx, { requiredGroups: ["Release Manager"] });

        const character = await ctx.db.character.create({
          data: {
            name: args.name,
            birthday: args.birthday,
            gender: args.gender,
          },
        });

        return character;
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
        await auth(ctx, { requiredGroups: ["Release Manager"] });

        const character = await ctx.db.character.delete({
          where: { id: args.id },
        });

        return character.id;
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
        await auth(ctx, { requiredGroups: ["Release Manager"] });

        const character = await ctx.db.character.update({
          where: { id: args.id },
          data: {
            name: args.name || undefined,
            birthday: args.birthday,
            gender: args.gender,
          },
        });

        return character;
      },
    });
  },
});

export const GetCharacterQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getCharacter", {
      type: "Character",
      args: {
        id: nonNull("Int"),
      },
      async resolve(_, args, ctx) {
        return ctx.db.character.findUnique({
          where: {
            id: args.id,
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
