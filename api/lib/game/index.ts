import { Account } from "@prisma/client";
import { DateTime as Time } from "luxon";
import { Context } from "../../context";
import { auth } from "../Auth";

export function isNew(last: Date, type: "hour" | "day"): boolean {
  if (type === "hour") {
    const lastHour = Time.fromMillis(last.getTime()).startOf("hour");
    const currentHour = Time.now().startOf("hour");

    return lastHour < currentHour;
  } else {
    const lastDay = Time.fromMillis(last.getTime()).startOf("day");
    const currentDay = Time.now().startOf("day");

    return lastDay < currentDay;
  }
}

export async function canClaimRewards(ctx: Context): Promise<number> {
  const account = await auth(ctx);

  const stats = await ctx.db.minigame.findFirst({
    where: { accountId: account.id },
  });

  if (!stats) return 3;

  if (isNew(stats.lastClaim, "hour")) return 3;

  if (stats.claimed < 3) return 3 - stats.claimed;

  return 0;
}

export async function canClaimPremiumCurrency(
  account: Account,
  ctx: Context
): Promise<number> {
  const stats = await ctx.db.minigame.findFirst({
    where: { accountId: account.id },
  });

  if (!stats) return 25;

  if (isNew(stats.lastPremiumClaim, "day")) return 25;

  if (stats.premiumClaimed < 25) return 25 - stats.premiumClaimed;

  return 0;
}
