import { Account } from "@prisma/client";
import { AuthenticationError } from "apollo-server";
import { User } from "discord-oauth2";
import { Context } from "../context";
import { discordOAuth2 } from "../graphql/util/auth/DiscordOAuth";

export async function checkAuth(ctx: Context): Promise<Account> {
  if (!ctx.req.headers.authorization)
    throw new AuthenticationError("You must be signed in to use that.");

  let user: User;

  try {
    user = await discordOAuth2.getUser(ctx.req.headers.authorization);
  } catch (e) {
    throw new AuthenticationError("You must be signed in to use that.");
  }

  const account = await ctx.db.account.findFirst({
    where: { discordId: user.id },
  });

  if (!account)
    throw new AuthenticationError("You must be signed in to use that.");

  return account;
}
