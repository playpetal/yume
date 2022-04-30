import { enumType, extendType, nonNull, objectType } from "nexus";
import { Song } from "nexus-prisma";
import { auth } from "../../../lib/Auth";
import { NotFoundError } from "../../../lib/error";
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
  name: "MinigameSong",
  description: "Contains song data for the 'Guess The Song' minigame.",
  definition(t) {
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
          await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

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
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const song = await ctx.db.song.findFirst({ where: { id: songId } });

        if (!song) throw new NotFoundError("there are no songs with that id.");

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
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const song = await ctx.db.song.findFirst({ where: { id: songId } });

        if (!song) throw new NotFoundError("there are no songs with that id.");

        const _song = await ctx.db.song.delete({ where: { id: song.id } });

        return _song.id;
      },
    });
  },
});

/*export const GetRandomSongQuery = extendType({
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
          group: song.group,
          soloist: song.soloist,
        };
      },
    });
  },
});*/

export const Reward = enumType({
  name: "Reward",
  members: ["CARD", "PETAL", "LILY"],
});
