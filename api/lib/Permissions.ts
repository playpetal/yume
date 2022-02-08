import { Context } from "../context";
import { NoPermissionError } from "./error";

type UserGroupString = "Developer" | "Release Manager";

export async function userInGroup(
  ctx: Context,
  discordId: string,
  req: UserGroupString[]
): Promise<boolean> {
  const account = await ctx.db.account.findFirst({
    where: { discordId },
    include: { userGroups: { include: { group: true } } },
  });

  if (!account) return false;

  const groups = account.userGroups.map((g) => g.group);
  const isDev = !!groups.find((g) => g.name === "Developer");

  if (isDev) return true;

  const isInRequiredGroup = !!groups.find((g) =>
    req.includes(g.name as UserGroupString)
  );

  if (!isInRequiredGroup) throw NoPermissionError;

  return isInRequiredGroup;
}
