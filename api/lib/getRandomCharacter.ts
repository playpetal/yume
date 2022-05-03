import { Character, Gender, Prisma } from "@prisma/client";
import { Context } from "../context";

export async function getRandomCharacter(
  ctx: Context,
  options?: { gender?: Gender; group?: string; groupIds?: number[] }
): Promise<Character> {
  let group: Prisma.GroupWhereInput = {};

  if (options?.group) {
    group = { name: { contains: options?.group, mode: "insensitive" } };
  } else if (options?.groupIds) {
    group = { id: { in: options?.groupIds } };
  }

  console.log(group, options);

  const characterCount = await ctx.db.character.count({
    where: {
      prefabs: {
        some: {
          release: { droppable: true },
          group,
        },
      },
      gender: options?.gender ?? undefined,
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
      prefabs: {
        some: {
          release: { droppable: true },
          group,
        },
      },
      gender: options?.gender ?? undefined,
    },
    skip,
    orderBy: { [orderBy]: orderDir },
  });

  if (!character) throw new Error("No characters available");

  return character;
}
