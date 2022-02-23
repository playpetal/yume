import { DateTime as Time } from "luxon";
import { Context } from "../../context";
import { checkAuth } from "../Auth";
import { roll } from "../card";

export function isNewHour(last: Date): boolean {
  const lastHour = Time.fromMillis(last.getTime()).startOf("hour");
  const currentHour = Time.now().startOf("hour");

  return lastHour < currentHour;
}

export async function canClaimRewards(ctx: Context): Promise<number> {
  const account = await checkAuth(ctx);

  const stats = await ctx.db.minigame.findFirst({
    where: { accountId: account.id },
  });

  if (!stats) return 3;

  if (isNewHour(stats.lastClaim)) return 3;

  if (stats.claimed < 3) return 3 - stats.claimed;

  return 0;
}

export async function claimRewards(
  ctx: Context,
  reward: "CARD" | "PETAL"
): Promise<number> {
  const account = await checkAuth(ctx);
  const canClaim = await canClaimRewards(ctx);

  if (!canClaim) throw new Error("cannot claim rewards");

  if (reward === "CARD") {
    const [card] = await roll(ctx, 1);
    return card.id;
  } else {
    await ctx.db.account.update({
      where: { id: account.id },
      data: {
        currency: { increment: 5 },
      },
    });

    return 5;
  }
}
