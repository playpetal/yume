import { UserInputError } from "apollo-server";
import { enumType, extendType, list, nonNull, objectType } from "nexus";
import { Song } from "nexus-prisma";
import { auth } from "../../../lib/Auth";
import { roll } from "../../../lib/card";
import { canClaimPremiumCurrency, canClaimRewards } from "../../../lib/game";
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
    t.field(Song.soloistId);
    t.field("soloist", {
      type: "Character",
      async resolve({ soloistId }, _, { db }) {
        if (!soloistId) return null;
        return await db.character.findFirst({ where: { id: soloistId } });
      },
    });
    t.field(Song.releaseId);
    t.field("release", {
      type: nonNull("Release"),
      async resolve({ releaseId }, _, ctx) {
        const release = await ctx.db.release.findFirst({
          where: { id: releaseId },
        });

        return release!;
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
    t.field("soloist", { type: "String" });
  },
});

export const CreateSong = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createSong", {
      type: nonNull("Song"),
      args: {
        title: nonNull("String"),
        url: nonNull("String"),
        groupId: "Int",
        soloistId: "Int",
        releaseId: "Int",
      },
      async resolve(_, { title, url, groupId, soloistId, releaseId }, ctx) {
        try {
          await auth(ctx, { requiredGroups: ["Release Manager"] });

          if (!releaseId) {
            const lastRelease = await ctx.db.release.findFirst({
              where: { droppable: false },
              orderBy: { id: "desc" },
            });

            if (!lastRelease) {
              const release = await ctx.db.release.create({ data: {} });
              releaseId = release.id;
            } else releaseId = lastRelease.id;
          }

          const song = await ctx.db.song.create({
            data: { title, groupId, soloistId, releaseId },
          });

          await gts.uploadSong({ id: song.id, video: url });

          return song;
        } catch (e) {
          console.log(e);
          throw e;
        }
      },
    });
  },
});

export const EditSong = extendType({
  type: "Mutation",
  definition(t) {
    t.field("editSong", {
      type: nonNull("Song"),
      args: {
        songId: nonNull("Int"),
        title: "String",
        groupId: "Int",
        soloistId: "Int",
        releaseId: "Int",
      },
      async resolve(_, { songId, title, groupId, soloistId, releaseId }, ctx) {
        await auth(ctx, { requiredGroups: ["Release Manager"] });

        const song = await ctx.db.song.findFirst({ where: { id: songId } });

        if (!song) throw new UserInputError("song not found");

        const _song = await ctx.db.song.update({
          where: { id: songId },
          data: {
            title: title ?? undefined,
            groupId,
            soloistId,
            releaseId: releaseId ?? undefined,
          },
        });

        return _song;
      },
    });
  },
});

export const DeleteSong = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteSong", {
      type: nonNull("Int"),
      args: { songId: nonNull("Int") },
      async resolve(_, { songId }, ctx) {
        await auth(ctx, { requiredGroups: ["Release Manager"] });

        const song = await ctx.db.song.findFirst({ where: { id: songId } });

        if (!song) throw new UserInputError("song not found");

        const _song = await ctx.db.song.delete({ where: { id: song.id } });

        return _song.id;
      },
    });
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
          soloist: song.soloist?.name,
        };
      },
    });
  },
});

export const Reward = enumType({
  name: "Reward",
  members: ["CARD", "PETAL", "LILY"],
});

export const ClaimMinigamePetalReward = extendType({
  type: "Mutation",
  definition(t) {
    t.field("claimMinigamePetalReward", {
      type: nonNull("Account"),
      async resolve(_, __, ctx) {
        const account = await auth(ctx);

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

export const ClaimMinigameLilyReward = extendType({
  type: "Mutation",
  definition(t) {
    t.field("claimMinigameLilyReward", {
      type: nonNull("Account"),
      async resolve(_, __, ctx) {
        const account = await auth(ctx);

        const canClaim = await canClaimRewards(ctx);
        if (!canClaim) throw new UserInputError("you cannot claim rewards");

        const canClaimPremium = await canClaimPremiumCurrency(account, ctx);

        await ctx.db.minigame.upsert({
          create: { accountId: account.id, claimed: 1, lastClaim: new Date() },
          update: {
            claimed: canClaim === 3 ? 1 : { increment: 1 },
            lastClaim: new Date(),
            premiumClaimed: canClaimPremium === 25 ? 1 : { increment: 1 },
            lastPremiumClaim: new Date(),
          },
          where: {
            accountId: account.id,
          },
        });

        return ctx.db.account.update({
          where: { id: account.id },
          data: { premiumCurrency: { increment: 1 } },
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
        const account = await auth(ctx);

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
        const account = await auth(ctx);

        await ctx.db.gTS.upsert({
          where: { accountId: account.id },
          create: {
            accountId: account.id,
            totalGames: 1,
            totalGuesses: guesses,
            totalTime: time,
            totalCurrency: reward === "CARD" ? 5 : undefined,
            totalCards: reward === "PETAL" ? 1 : undefined,
            totalPremiumCurrency: reward === "LILY" ? 1 : undefined,
          },
          update: {
            totalGames: { increment: 1 },
            totalGuesses: { increment: guesses },
            totalTime: { increment: time },
            totalCurrency: reward === "PETAL" ? { increment: 5 } : undefined,
            totalCards: reward === "CARD" ? { increment: 1 } : undefined,
            totalPremiumCurrency:
              reward === "LILY" ? { increment: 1 } : undefined,
          },
        });

        return true;
      },
    });
  },
});
