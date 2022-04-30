import { Character, Gender } from "@prisma/client";
import { Context } from "../context";

export async function getRandomCharacter(
  ctx: Context,
  options?: { gender?: Gender; group?: string }
): Promise<Character> {
  const characterCount = await ctx.db.character.count({
    where: {
      prefabs: {
        some: {
          release: { droppable: true },
          group: { name: { equals: options?.group, mode: "insensitive" } },
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
          group: { name: { equals: options?.group, mode: "insensitive" } },
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
