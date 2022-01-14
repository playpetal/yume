import { extendType, objectType } from "nexus";
import { Song } from "nexus-prisma";

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

export const GetRandomSongQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getRandomSong", {
      type: "Song",
      args: { gender: "GroupGender" },
      async resolve(_, args, ctx) {
        const songCount = await ctx.db.song.count();
        const skip = Math.round(Math.random() * (songCount - 1));
        const orderBy = ["id", "title", "groupId"][
          Math.floor(Math.random() * 3)
        ];
        const orderDir = ["asc", "desc"][Math.floor(Math.random() * 2)];

        console.log(
          `picking randomly from ${songCount} songs, skipping ${skip}, ordering by ${orderBy} ${orderDir}`
        );

        return ctx.db.song.findFirst({
          take: 1,
          skip,
          orderBy: { [orderBy]: orderDir },
          where: args.gender ? { group: { gender: args.gender } } : undefined,
        });
      },
    });
  },
});
