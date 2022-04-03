import { Account } from "@prisma/client";
import { Flag } from "yume";
import { Context } from "../context";

export const FLAGS = {
  DEVELOPER: 0,
  RELEASE_MANAGER: 1,
  PUBLIC_SUPPORTER: 2,
} as const;

export async function toggleFlag(
  flag: Flag,
  account: Account,
  ctx: Context
): Promise<Account> {
  let flags = account.flags;
  flags ^= 1 << FLAGS[flag];

  const _account = await ctx.db.account.update({
    where: { id: account.id },
    data: { flags },
  });

  return _account;
}
