import { extendType, nonNull, objectType } from "nexus";
import { Account } from "nexus-prisma";
import { discordOAuth2 } from "../util/auth/DiscordOAuth";
import { UserInputError, AuthenticationError } from "apollo-server";

export const AccountObject = objectType({
  name: Account.$name,
  description: Account.$description,
  definition(t) {
    t.field(Account.id);
    t.field(Account.discordId);
    t.field(Account.username);
    t.field(Account.createdAt);
  },
});

export const GetMeQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("me", {
      type: "Account",
      async resolve(_, __, ctx) {
        if (!ctx.req.headers.authorization)
          throw new AuthenticationError(
            "Authorization is required to use this query."
          );

        try {
          const user = await discordOAuth2.getUser(
            ctx.req.headers.authorization
          );

          return await ctx.db.account.findFirst({
            where: { discordId: user.id },
          });
        } catch (e) {
          if (e instanceof UserInputError) throw e;

          console.log(`Error while attempting to retrieve self: ${e}`);
          throw new AuthenticationError(
            "An error occurred while retrieving your account."
          );
        }
      },
    });
  },
});

export const CreateAccountMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createAccount", {
      type: nonNull("Account"),
      args: {
        username: nonNull("String"),
      },
      async resolve(_, args, ctx) {
        if (!ctx.req.headers.authorization)
          throw new AuthenticationError(
            "Authorization is required to use this mutation."
          );

        try {
          const user = await discordOAuth2.getUser(
            ctx.req.headers.authorization
          );

          const accountExists = await ctx.db.account.findFirst({
            where: { discordId: user.id },
          });
          if (accountExists)
            throw new UserInputError("You already have an account.");

          const usernameExists = await ctx.db.account.findFirst({
            where: { username: args.username },
          });
          if (usernameExists)
            throw new UserInputError("That username is already taken.");

          return await ctx.db.account.create({
            data: { discordId: user.id, username: args.username },
          });
        } catch (e) {
          if (e instanceof UserInputError) throw e;

          console.log(`Error while attempting authentication: ${e}`);
          throw new AuthenticationError(
            "An error occurred while authorizing with Discord."
          );
        }
      },
    });
  },
});

export const GetUserQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("user", {
      type: "Account",
      args: { username: "String", id: "Int" },
      async resolve(_, args, ctx) {
        /*if (!ctx.req.headers.authorization)
          throw new AuthenticationError(
            "Authorization is reuqired to use this query."
          );*/

        return ctx.db.account.findFirst({
          where: {
            username: args.username ?? undefined,
            id: args.id ?? undefined,
          },
        });
      },
    });
  },
});
