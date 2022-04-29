import { Account } from "@prisma/client";
import { Context } from "../../../context";

export async function modifyPremiumCurrency(
  ctx: Context,
  account: Account,
  amount: number
): Promise<Account> {
  const _account = await ctx.db.account.update({
    where: { id: account.id },
    data: { premiumCurrency: { increment: amount } },
  });

  return _account;
}
