import { extendType, nonNull, objectType } from "nexus";
import { Song } from "nexus-prisma";
import { checkAuth } from "../../../lib/Auth";
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
    t.field("group", { type: nonNull("String") });
    t.field("maxReward", { type: nonNull("Int") });
    t.field("timeLimit", { type: nonNull("Int") });
    t.field("maxGuesses", { type: nonNull("Int") });
    t.field("remainingGames", { type: nonNull("Int") });
    t.field("isNewHour", { type: nonNull("Boolean") });
  },
});

export const GetRandomSongQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getRandomSong", {
      type: "GameSong",
      args: { gender: "GroupGender" },
      async resolve(_, args, ctx) {
        const account = await checkAuth(ctx);
        const song = await gts.getSong(ctx, account, args.gender ?? undefined);

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
          group: song.group.name,
        };
      },
    });
  },
});

export const SetMaxRewardMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("setMaxGtsReward", {
      type: nonNull("Int"),
      args: { maxReward: nonNull("Int") },
      async resolve(_, args, ctx) {
        await ctx.redis.set("gts:maxreward", args.maxReward);
        return args.maxReward;
      },
    });
  },
});

export const CompleteGTSMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("completeGts", {
      type: nonNull("Int"),
      args: {
        guesses: nonNull("Int"),
        time: nonNull("Int"),
        reward: nonNull("Int"),
        correct: nonNull("Boolean"),
        isNewHour: nonNull("Boolean"),
      },
      async resolve(_, { guesses, time, reward, correct, isNewHour }, ctx) {
        const account = await checkAuth(ctx);

        await ctx.db.gTS.upsert({
          where: { accountId: account.id },
          create: {
            accountId: account.id,
            totalGames: 1,
            totalGuesses: guesses,
            totalRewards: correct ? reward : 0,
            totalTime: time,
            games: correct ? 1 : 0,
            lastGame: new Date(),
          },
          update: {
            totalGames: { increment: 1 },
            totalGuesses: { increment: guesses },
            totalRewards: correct ? { increment: reward } : undefined,
            totalTime: { increment: time },
            games: correct
              ? reward > 0
                ? isNewHour
                  ? 1
                  : { increment: 1 }
                : undefined
              : undefined,
            lastGame: correct ? new Date() : undefined,
          },
        });

        if (reward > 0)
          await ctx.db.account.update({
            data: { currency: { increment: reward } },
            where: { id: account.id },
          });

        return reward;
      },
    });
  },
});
