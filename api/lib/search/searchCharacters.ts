import { Character, Gender, Prisma } from "@prisma/client";
import { Context } from "../../context";

export async function searchCharacters(
  ctx: Context,
  {
    birthday,
    birthdayBefore,
    birthdayAfter,
    search,
    gender,
    page,
    minLetters,
    maxLetters,
  }: {
    birthday?: Date;
    birthdayBefore?: Date;
    birthdayAfter?: Date;
    search: string;
    gender?: Gender;
    page?: number;
    minLetters?: number;
    maxLetters?: number;
  }
) {
  let filter: Prisma.DateTimeNullableFilter = {};

  if (birthday) {
    filter["equals"] = birthday;
  } else if (birthdayBefore || birthdayAfter) {
    filter["lt"] = birthdayBefore;
    filter["gt"] = birthdayAfter;
  }

  const characters: Character[] = await ctx.db.character.findMany({
    where: {
      name: { contains: search, mode: "insensitive" },
      birthday: filter,
      gender: gender,
    },
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
}
