import { CardPrefab } from "@prisma/client";
import { Context } from "../../context";

export async function incrementIssue(
  ctx: Context,
  prefab: CardPrefab
): Promise<number> {
  const { lastIssue } = await ctx.db.cardPrefab.update({
    data: { lastIssue: { increment: 1 } },
    where: { id: prefab.id },
  });
  return lastIssue;
}
