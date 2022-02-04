import { extendType, list, nonNull, objectType } from "nexus";
import { Account } from "nexus-prisma";
import { discordOAuth2 } from "../util/auth/DiscordOAuth";
import { UserInputError, AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";
import { checkAuth } from "../../lib/Auth";

export const AccountObject = objectType({
  name: Account.$name,
  description: Account.$description,
  definition(t) {
    t.field(Account.id);
    t.field(Account.discordId);
    t.field(Account.username);
    t.field(Account.createdAt);
    t.field(Account.activeTitleId);
    t.field(Account.bio);
    t.field(Account.currency);
    t.field("stats", {
      type: "AccountStats",
      async resolve(root, _, ctx) {
        const cardCount = await ctx.db.card.count({
          where: { ownerId: root.id },
        });
        const gts = await ctx.db.gTS.findFirst({
          where: { accountId: root.id },
        });
        const rollCount = await ctx.db.rollLog.count({
          where: { accountId: root.id },
        });

        return {
          cardCount,
          gtsGuessCount: gts?.totalGuesses || 0,
          gtsTotalGames: gts?.totalGames || 0,
          gtsTotalTime: gts?.totalTime || 0,
          gtsTotalRewards: gts?.totalRewards || 0,
          rollCount,
        };
      },
    });
    t.field("title", {
      type: "Title",
      async resolve(root, _, ctx) {
        if (!root.activeTitleId) return null;

        const inventory = await ctx.db.titleInventory.findFirst({
          where: { id: root.activeTitleId },
          select: { title: true },
        });

        return inventory?.title || null;
      },
    });
    t.field("groups", {
      type: nonNull(list(nonNull("AccountUserGroup"))),
      resolve(root, __, ctx) {
        return ctx.db.accountUserGroup.findMany({
          where: { accountId: root.id },
        });
      },
    });
  },
});

export const AccountStatsObject = objectType({
  name: "AccountStats",
  description: "Account Stats",
  definition(t) {
    t.field("cardCount", { type: nonNull("Int") });
    t.field("gtsTotalGames", { type: nonNull("Int") });
    t.field("gtsGuessCount", { type: nonNull("Int") });
    t.field("gtsTotalTime", { type: nonNull("Int") });
    t.field("gtsTotalRewards", { type: nonNull("Int") });
    t.field("rollCount", { type: nonNull("Int") });
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
        const auth = ctx.req.headers.authorization;
        if (!auth)
          throw new AuthenticationError(
            "Authorization is required to use this mutation."
          );

        let discordId: string | undefined;

        const usernameIsInvalid = RegExp(/[^A-Za-z0-9 _-]+/gm).exec(
          args.username
        );
        if (usernameIsInvalid)
          throw new UserInputError(
            "Username cannot contain non-alphanumeric characters except for space, _, and -."
          );

        if (args.username.length > 20)
          throw new UserInputError("Username cannot exceed 20 characters.");

        try {
          const { id } = jwt.verify(auth, process.env.SHARED_SECRET!) as {
            id: string;
          };

          discordId = id;
        } catch (e) {
          console.error(e);
          throw new AuthenticationError("Invalid JWT");
        }

        const accountExists = await ctx.db.account.findFirst({
          where: { discordId },
        });

        if (accountExists)
          throw new UserInputError("You already have an account.");

        const usernameExists = await ctx.db.account.findFirst({
          where: { username: args.username },
        });

        if (usernameExists)
          throw new UserInputError("That username is already taken.");

        return await ctx.db.account.create({
          data: { discordId, username: args.username },
        });
      },
    });
  },
});

export const GetUserQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("user", {
      type: "Account",
      args: { username: "String", id: "Int", discordId: "String" },
      async resolve(_, args, ctx) {
        /*if (!ctx.req.headers.authorization)
          throw new AuthenticationError(
            "Authorization is reuqired to use this query."
          );*/

        return ctx.db.account.findFirst({
          where: {
            username: args.username ?? undefined,
            id: args.id ?? undefined,
            discordId: args.discordId ?? undefined,
          },
        });
      },
    });
  },
});

export const SetBioMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("setBio", {
      type: nonNull("Account"),
      args: { bio: "String" },
      async resolve(_, args, ctx) {
        const auth = ctx.req.headers.authorization;
        if (!auth)
          throw new AuthenticationError(
            "Authorization is required to use this mutation."
          );

        try {
          const { id } = jwt.verify(auth, process.env.SHARED_SECRET!) as {
            id: string;
          };

          return ctx.db.account.update({
            where: { discordId: id },
            data: { bio: args.bio },
          });
        } catch (e) {
          console.log(e);
          throw new Error("An unexpected error occurred.");
        }
      },
    });
  },
});

export const SetUserTitle = extendType({
  type: "Mutation",
  definition(t) {
    t.field("setUserTitle", {
      type: nonNull("Account"),
      args: { id: nonNull("Int") },
      async resolve(_, args, ctx) {
        const auth = await checkAuth(ctx);

        return ctx.db.account.update({
          where: { id: auth.id },
          data: { activeTitleId: args.id },
        });
      },
    });
  },
});
