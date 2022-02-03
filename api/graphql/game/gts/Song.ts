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
        songId: nonNull("Int"),
        correct: nonNull("Boolean"),
        startedAt: nonNull("DateTime"),
      },
      async resolve(_, args, ctx) {
        const account = await checkAuth(ctx);

        await ctx.db.gTSLog.create({
          data: {
            accountId: account.id,
            correct: args.correct,
            songId: args.songId,
            createdAt: new Date(args.startedAt),
          },
        });

        await ctx.db.gTS.upsert({
          create: {
            accountId: account.id,
            totalGames: 1,
            totalGuesses: args.guesses,
            totalRewards: args.reward,
            totalTime: args.time,
          },
          update: {
            totalGames: { increment: args.correct ? 1 : 0 },
            totalGuesses: { increment: args.guesses },
            totalRewards: { increment: args.reward },
            totalTime: { increment: args.time },
          },
          where: { accountId: account.id },
        });

        if (args.correct)
          await ctx.db.account.update({
            data: { currency: { increment: args.reward } },
            where: { id: account.id },
          });

        return args.reward;
      },
    });
  },
});
