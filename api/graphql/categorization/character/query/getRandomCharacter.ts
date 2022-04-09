import { extendType, nonNull } from "nexus";

export const getRandomCharacter = extendType({
  type: "Query",
  definition(t) {
    t.field("getRandomCharacter", {
      type: nonNull("Character"),
      args: {
        gender: "Gender",
      },
      async resolve(_, { gender }, ctx) {
        const characterCount = await ctx.db.character.count({
          where: {
            prefabs: { some: { release: { droppable: true } } },
            gender: gender ?? undefined,
          },
        });

        if (characterCount === 0) throw new Error("no characters available");

        const skip = Math.round(Math.random() * (characterCount - 1));
        const orderBy = ["id", "birthday", "name", "gender"][
          Math.floor(Math.random() * 4)
        ];
        const orderDir = ["asc", "desc"][Math.floor(Math.random() * 2)];

        const character = await ctx.db.character.findFirst({
          where: {
            prefabs: { some: { release: { droppable: true } } },
            gender: gender ?? undefined,
          },
          skip,
          orderBy: { [orderBy]: orderDir },
        });

        if (!character) throw new Error("No characters available");

        return character;
      },
    });
  },
});
