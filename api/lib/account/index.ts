import { Context } from "../../context";

export async function getAccountStats(ctx: Context, id: number) {
  const cardCount = await ctx.db.card.count({
    where: { ownerId: id },
  });
  const gts = await ctx.db.gTS.findFirst({
    where: { accountId: id },
  });
  const rollCount = await ctx.db.rollLog.count({
    where: { accountId: id },
  });

  return {
    cardCount,
    gtsGuessCount: gts?.totalGuesses || 0,
    gtsTotalGames: gts?.totalGames || 0,
    gtsTotalTime: gts?.totalTime || 0,
    gtsTotalRewards: gts?.totalRewards || 0,
    rollCount,
    gtsCurrentGames: gts?.games || 0,
    gtsLastGame: gts?.lastGame || null,
  };
}
