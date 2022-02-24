import { UserInputError } from "apollo-server";
import { enumType, extendType, list, nonNull, objectType } from "nexus";
import { Song } from "nexus-prisma";
import { checkAuth } from "../../../lib/Auth";
import { roll } from "../../../lib/card";
import { canClaimRewards } from "../../../lib/game";
import { gts } from "../../../lib/gts";

export const SongObject = objectType({
  name: Song.$name,
  description: Song.$description,
  definition(t) {
    t.field(Song.id);
    t.field(Song.title);
    t.field(Song.groupId);
    t.field("group", {
      type: "Group",
      async resolve(song, _, ctx) {
        if (!song.groupId) return null;
        return (await ctx.db.group.findFirst({
          where: { id: song.groupId },
        }))!;
      },
    });
  },
});

export const GameSongObject = objectType({
  name: "GameSong",
  description: "Game song",
  definition(t) {
    t.field("id", { type: nonNull("Int") });
    t.field("video", { type: nonNull("String") });
    t.field("title", { type: nonNull("String") });
    t.field("group", { type: "String" });
  },
});

export const GetRandomSongQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getRandomSong", {
      type: "GameSong",
      args: { gender: "GroupGender" },
      async resolve(_, args, ctx) {
        const song = await gts.getSong(ctx, args.gender ?? undefined);

        if (!song) return null;

        gts.getStackLength(ctx).then(async (v) => {
          if (v < 50) {
            await gts.requestSong(ctx);
          }
        });

        gts.getStackLength(ctx, "MALE").then(async (v) => {
          if (v < 50) {
            await gts.requestSong(ctx, true, "MALE");
          }
        });

        gts.getStackLength(ctx, "FEMALE").then(async (v) => {
          if (v < 50) {
            await gts.requestSong(ctx, true, "FEMALE");
          }
        });

        return {
          ...song,
          group: song.group?.name,
        };
      },
    });
  },
});

export const Reward = enumType({
  name: "Reward",
  members: ["CARD", "PETAL"],
});

export const ClaimMinigamePetalReward = extendType({
  type: "Mutation",
  definition(t) {
    t.field("claimMinigamePetalReward", {
      type: nonNull("Account"),
      async resolve(_, __, ctx) {
        const account = await checkAuth(ctx);

        const canClaim = await canClaimRewards(ctx);
        if (!canClaim) throw new UserInputError("you cannot claim rewards");

        await ctx.db.minigame.upsert({
          create: { accountId: account.id, claimed: 1, lastClaim: new Date() },
          update: {
            claimed: canClaim === 3 ? 1 : { increment: 1 },
            lastClaim: new Date(),
          },
          where: {
            accountId: account.id,
          },
        });

        return ctx.db.account.update({
          where: { id: account.id },
          data: { currency: { increment: 5 } },
        });
      },
    });
  },
});

export const ClaimMinigameCardReward = extendType({
  type: "Mutation",
  definition(t) {
    t.field("claimMinigameCardReward", {
      type: nonNull(list(nonNull("Card"))),
      async resolve(_, __, ctx) {
        const account = await checkAuth(ctx);

        const canClaim = await canClaimRewards(ctx);
        if (!canClaim) throw new UserInputError("you cannot claim rewards");

        await ctx.db.minigame.upsert({
          create: { accountId: account.id, claimed: 1, lastClaim: new Date() },
          update: {
            claimed: canClaim === 3 ? 1 : { increment: 1 },
            lastClaim: new Date(),
          },
          where: {
            accountId: account.id,
          },
        });

        return roll(ctx, { amount: 1, free: true });
      },
    });
  },
});

export const CompleteGTS = extendType({
  type: "Mutation",
  definition(t) {
    t.field("completeGts", {
      type: nonNull("Boolean"),
      args: {
        reward: nonNull("Reward"),
        guesses: nonNull("Int"),
        time: nonNull("Int"),
      },
      async resolve(_, { reward, guesses, time }, ctx) {
        const account = await checkAuth(ctx);

        await ctx.db.gTS.upsert({
          where: { accountId: account.id },
          create: {
            accountId: account.id,
            totalGames: 1,
            totalGuesses: guesses,
            totalTime: time,
            totalCurrency: reward === "CARD" ? 5 : undefined,
            totalCards: reward === "PETAL" ? 1 : undefined,
          },
          update: {
            totalGames: { increment: 1 },
            totalGuesses: { increment: guesses },
            totalTime: { increment: time },
            totalCurrency: reward === "PETAL" ? { increment: 5 } : undefined,
            totalCards: reward === "CARD" ? { increment: 1 } : undefined,
          },
        });

        return true;
      },
    });
  },
});
