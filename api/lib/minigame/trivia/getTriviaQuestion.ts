import { Bias, GroupGender, Prisma } from "@prisma/client";
import { Context } from "../../../context";
import { UserFacingError } from "../../error";

export async function getTriviaQuestion(
  ctx: Context,
  options?: { biasList?: Bias[]; gender?: GroupGender; group?: string }
) {
  let group: Prisma.GroupWhereInput = {
    cards: { some: { release: { droppable: true } } },
  };

  if (options?.biasList && options.biasList.length > 0)
    group["id"] = { in: options.biasList.map((b) => b.groupId) };

  if (options?.gender) group["gender"] = options?.gender;
  if (options?.group)
    group["name"] = { contains: options.group, mode: "insensitive" };

  const questions = await ctx.db.trivia.findMany({
    where: { solutions: { some: { correct: true } }, group },
    include: { solutions: true, group: true },
  });

  if (questions.length === 0)
    throw new UserFacingError(
      "there aren't any questions matching your input... yet."
    );

  return questions[Math.floor(Math.random() * questions.length)];
}
