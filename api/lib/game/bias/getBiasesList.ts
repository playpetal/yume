import { Account, Bias } from "@prisma/client";
import { Context } from "../../../context";

export async function getBiasList(
  ctx: Context,
  account: Account
): Promise<Bias[]> {
  const biases = await ctx.db.bias.findMany({
    where: { accountId: account.id },
  });

  return biases;
}
