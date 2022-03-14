import { Account } from "@prisma/client";
import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";
import { UserGroup } from "yume";
import { Context } from "../context";

export async function auth(
  ctx: Context,
  options?: { requiredGroups?: UserGroup[] }
): Promise<Account> {
  if (!ctx.req.headers.authorization)
    throw new AuthenticationError("you must be signed in to use that.");

  try {
    const { id } = jwt.verify(
      ctx.req.headers.authorization,
      process.env.SHARED_SECRET!
    ) as { id: string };

    const account = await ctx.db.account.findFirst({
      where: { discordId: id },
      include: { userGroups: { include: { group: true } } },
    });

    if (!account) throw new AuthenticationError("invalid token");

    if (!options) return account;

    if (options.requiredGroups) {
      const groups = account.userGroups.map((g) => g.group.name);

      if (groups.includes("Developer")) return account;

      for (let group of options.requiredGroups) {
        if (!groups.find((g) => g === group))
          throw new AuthenticationError("you are not authorized to do that.");
      }
    }

    return account;
  } catch (e: unknown) {
    if (e instanceof AuthenticationError) throw e;
    console.error(e);
    throw new AuthenticationError(
      "an error occurred while authenticating your account."
    );
  }
}
