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
      },
      async resolve(
        _,
        { search, birthday, birthdayBefore, birthdayAfter, gender, page },
        ctx
      ) {
        let filter: Prisma.DateTimeNullableFilter = {};

        if (birthday) {
          filter = birthday;
        } else if (birthdayBefore || birthdayAfter) {
          filter["lt"] = birthdayBefore;
          filter["gt"] = birthdayAfter;
        }

        return ctx.db.character.findMany({
          where: {
            name: { contains: search, mode: "insensitive" },
            birthday: filter,
            gender: gender,
          },
          take: 25,
          skip: Math.max(page || 1, 1) * 25 - 25,
        });
      },
    });
  },
});
