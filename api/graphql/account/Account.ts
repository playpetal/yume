import { extendType, list, nonNull, objectType } from "nexus";
import { Account } from "nexus-prisma";
import { UserInputError, AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";
import { checkAuth } from "../../lib/Auth";
import { getAccountStats } from "../../lib/account";
import { Card } from "@prisma/client";
import { canClaimRewards } from "../../lib/game";

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
    t.field("gts", {
      type: "GTS",
      async resolve(root, _, ctx) {
        return ctx.db.gTS.findFirst({ where: { accountId: root.id } });
      },
    });
    t.field("stats", {
      type: "AccountStats",
      async resolve(root, _, ctx) {
        return getAccountStats(ctx, root.id);
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

export const GTSStats = objectType({
  name: "GTS",
  description: "GTS Statistics",
  definition(t) {
    t.field("accountId", { type: nonNull("Int") });
    t.field("totalGuesses", { type: nonNull("Int") });
    t.field("totalTime", { type: nonNull("Int") });
    t.field("totalGames", { type: nonNull("Int") });
    t.field("totalCards", { type: nonNull("Int") });
    t.field("totalCurrency", { type: nonNull("Int") });
  },
});

export const AccountStatsObject = objectType({
  name: "AccountStats",
  description: "Account Stats",
  definition(t) {
    t.field("cardCount", { type: nonNull("Int") });
    t.field("rollCount", { type: nonNull("Int") });
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

export const Gift = extendType({
  type: "Mutation",
  definition(t) {
    t.field("gift", {
      type: nonNull("Boolean"),
      args: {
        recipientId: nonNull("Int"),
        cardIds: list(nonNull("Int")),
        petals: "Int",
      },
      async resolve(_, { recipientId, cardIds, petals }, ctx) {
        const account = await checkAuth(ctx);
        const recipient = await ctx.db.account.findFirst({
          where: { id: recipientId },
        });

        if (!recipient)
          throw new UserInputError(`i couldn't find that user :(`);

        if (petals) {
          if (account.currency < petals)
            throw new UserInputError(
              "you don't have enough petals to do that."
            );

          await ctx.db.account.update({
            where: { id: account.id },
            data: { currency: { decrement: petals } },
          });

          await ctx.db.account.update({
            where: { id: recipient.id },
            data: { currency: { increment: petals } },
          });
        }

        if (cardIds && cardIds.length > 0) {
          const cards: Card[] = [];

          for (let cardId of cardIds) {
            const card = await ctx.db.card.findFirst({ where: { id: cardId } });

            if (!card)
              throw new UserInputError(
                `\`${cardId.toString(16)}\` does not exist.`
              );
            if (card.ownerId !== account.id)
              throw new UserInputError(
                `\`${cardId.toString(16)}\` does not belong to you.`
              );

            cards.push(card);
          }

          if (cards.length > 0) {
            await ctx.db.card.updateMany({
              where: { id: { in: cards.map((c) => c.id) } },
              data: { ownerId: recipient.id },
            });
          }
        }

        return true;
      },
    });
  },
});

export const CanClaimRewards = extendType({
  type: "Query",
  definition(t) {
    t.field("canClaimRewards", {
      type: nonNull("Int"),
      async resolve(_, __, ctx) {
        return await canClaimRewards(ctx);
      },
    });
  },
});
