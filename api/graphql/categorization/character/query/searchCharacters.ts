import { Prisma } from "@prisma/client";
import { extendType, nonNull, list } from "nexus";

export const SearchCharactersQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("searchCharacters", {
      type: nonNull(list(nonNull("Character"))),
      args: {
        search: nonNull("String"),
        birthday: "DateTime",
        birthdayBefore: "DateTime",
        birthdayAfter: "DateTime",
        gender: "Gender",
        page: "Int",
        minLetters: "Int",
        maxLetters: "Int",
        group: "String",
      },
      async resolve(
        _,
        {
          search,
          birthday,
          birthdayBefore,
          birthdayAfter,
          minLetters,
          maxLetters,
          gender,
          page,
          group,
        },
        ctx
      ) {
        let filter: Prisma.DateTimeNullableFilter = {};

        if (birthday) {
          filter = birthday;
        } else if (birthdayBefore || birthdayAfter) {
          filter["lt"] = birthdayBefore;
          filter["gt"] = birthdayAfter;
        }

        const characters = await ctx.db.character.findMany({
          where: {
            name: { contains: search, mode: "insensitive" },
            birthday: filter,
            gender: gender,
            prefabs: {
              some: {
                group: {
                  name: { contains: group ?? undefined, mode: "insensitive" },
                },
              },
            },
          },
          /*take: 25,
          skip: Math.max(page || 1, 1) * 25 - 25,*/
        });

        const _page = Math.max(page || 1, 1);

        if (!minLetters && !maxLetters)
          return characters.slice(_page * 25 - 25, _page * 25);

        const filteredCharacters = characters.filter((c) => {
          if (minLetters && maxLetters) {
            return c.name.length <= maxLetters && c.name.length >= minLetters;
          }

          if (maxLetters) return c.name.length <= maxLetters;
          if (minLetters) return c.name.length >= minLetters;
        });

        return filteredCharacters.slice(_page * 25 - 25, _page * 25);
      },
    });
  },
});
