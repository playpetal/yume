import { Context } from "../../context";

export async function getAccountStats(ctx: Context, id: number) {
  const cardCount = await ctx.db.card.count({
    where: { ownerId: id },
  });
  const rollCount = await ctx.db.rollLog.count({
    where: { accountId: id },
  });

  return {
    cardCount,
    rollCount,
  };
}
