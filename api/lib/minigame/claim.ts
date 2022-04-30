import { Account } from "@prisma/client";
import { Context } from "../../context";

export async function claim(
  ctx: Context,
  account: Account,
  claimed: number
): Promise<void> {
  await ctx.db.minigame.upsert({
    create: { accountId: account.id, claimed: 1, lastClaim: new Date() },
    update: {
      claimed: claimed === 3 ? 1 : { increment: 1 },
      lastClaim: new Date(),
    },
    where: {
      accountId: account.id,
    },
  });
}

export async function claimPremium(
  ctx: Context,
  account: Account,
  claimed: number,
  premiumClaimed: number
): Promise<void> {
  await ctx.db.minigame.upsert({
    create: { accountId: account.id, claimed: 1, lastClaim: new Date() },
    update: {
      claimed: claimed === 3 ? 1 : { increment: 1 },
      lastClaim: new Date(),
      premiumClaimed: premiumClaimed === 25 ? 1 : { increment: 1 },
      lastPremiumClaim: new Date(),
    },
    where: {
      accountId: account.id,
    },
  });
}
