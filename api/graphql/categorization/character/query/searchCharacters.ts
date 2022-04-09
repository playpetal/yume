import { extendType, nonNull, list } from "nexus";

export const SearchCharactersQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("searchCharacters", {
      type: nonNull(list(nonNull("Character"))),
      args: {
        search: nonNull("String"),
        birthday: "DateTime",
        page: "Int",
      },
      async resolve(_, { search, birthday, page }, ctx) {
        return ctx.db.character.findMany({
          where: {
            name: { contains: search, mode: "insensitive" },
            birthday: birthday,
          },
          take: 25,
          skip: Math.max(page || 1, 1) * 25 - 25,
        });
      },
    });
  },
});
