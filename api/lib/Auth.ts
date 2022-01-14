import { Account } from "@prisma/client";
import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";
import { Context } from "../context";

export async function checkAuth(ctx: Context): Promise<Account> {
  if (!ctx.req.headers.authorization)
    throw new AuthenticationError("You must be signed in to use that.");

  try {
    const { id } = jwt.verify(
      ctx.req.headers.authorization,
      process.env.SHARED_SECRET!
    ) as { id: string };

    const account = await ctx.db.account.findFirst({
      where: { discordId: id },
    });

    if (!account)
      throw new AuthenticationError("You must be signed in to use that.");

    return account;
  } catch (e) {
    throw new AuthenticationError("You must be signed in to use that.");
  }
}
