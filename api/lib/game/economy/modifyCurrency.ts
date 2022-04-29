import { Account } from "@prisma/client";
import { Context } from "../../../context";

export async function modifyCurrency(
  ctx: Context,
  account: Account,
  amount: number
): Promise<Account> {
  const _account = await ctx.db.account.update({
    where: { id: account.id },
    data: { currency: { increment: amount } },
  });

  return _account;
}
