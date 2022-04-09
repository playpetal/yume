import { Context } from "../../context";

export async function upsertMinigameStats(
  ctx: Context,
  minigame: "GTS" | "GUESS_CHARACTER" | "WORDS",
  account: { id: number },
  reward: { type: "PETAL" | "CARD" | "LILY"; amount: number },
  games: number,
  attempts: number,
  time: number
): Promise<void> {
  await ctx.db.minigameStats.upsert({
    where: {
      accountId_type: { accountId: account.id, type: minigame },
    },
    create: {
      type: minigame,
      accountId: account.id,
      totalGames: games,
      totalAttempts: attempts,
      totalTime: time,
      totalCurrency: reward.type === "PETAL" ? reward.amount : undefined,
      totalCards: reward.type === "CARD" ? reward.amount : undefined,
      totalPremiumCurrency: reward.type === "LILY" ? reward.amount : undefined,
    },
    update: {
      totalGames: { increment: games },
      totalAttempts: { increment: attempts },
      totalTime: { increment: time },
      totalCurrency:
        reward.type === "PETAL" ? { increment: reward.amount } : undefined,
      totalCards:
        reward.type === "CARD" ? { increment: reward.amount } : undefined,
      totalPremiumCurrency:
        reward.type === "LILY" ? { increment: reward.amount } : undefined,
    },
  });

  return;
}
