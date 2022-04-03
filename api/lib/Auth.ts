import { Account } from "@prisma/client";
import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";
import { Flag } from "yume";
import { Context } from "../context";
import { FLAGS } from "./flags";

export async function auth(
  ctx: Context,
  options?: { requiredFlags?: Flag[] }
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
    });

    if (!account) throw new AuthenticationError("invalid token");

    if (!options) return account;

    if (options.requiredFlags) {
      const flags = Number(account.flags.toString(2));

      if (flags & (1 << FLAGS.DEVELOPER)) return account;

      for (let flag of options.requiredFlags) {
        const bit = FLAGS[flag];

        if (!(flags & (1 << bit)))
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
