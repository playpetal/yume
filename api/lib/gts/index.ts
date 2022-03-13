import axios from "axios";
import { GroupGender } from "@prisma/client";
import { Context } from "../../context";

type Song = {
  id: number;
  title: string;
  group?: { name: string } | null;
  soloist?: { name: string } | null;
};
type RedisSong = Song & { video: string };

class GTSManager {
  private badSongs: number[] = [];

  public async getStackLength(
    { redis }: Context,
    gender?: GroupGender
  ): Promise<number> {
    return await redis.llen(`gts:songs:${gender?.toLowerCase() || "all"}`);
  }

  public async getSong(
    ctx: Context,
    gender?: GroupGender
  ): Promise<RedisSong | undefined> {
    const song = await ctx.redis.rpop(
      `gts:songs:${gender?.toLowerCase() || "all"}`
    );

    if (song) return JSON.parse(song) as RedisSong;

    const requestedSong = await this.requestSong(ctx, false, gender);
    if (!requestedSong) return;

    return requestedSong;
  }

  public async requestSong(
    { redis, db }: Context,
    addToStack: boolean = true,
    gender?: GroupGender
  ): Promise<RedisSong | undefined> {
    const songCount = await db.song.count({
      where: {
        id: { notIn: this.badSongs },
        group: gender ? { gender } : undefined,
      },
    });

    if (songCount === 0) return;

    const skip = Math.round(Math.random() * (songCount - 1));
    const orderBy = ["id", "title", "groupId"][Math.floor(Math.random() * 3)];
    const orderDir = ["asc", "desc"][Math.floor(Math.random() * 2)];

    const song = await db.song.findFirst({
      take: 1,
      skip,
      orderBy: { [orderBy]: orderDir },
      where: {
        id: { notIn: this.badSongs },
        group: gender ? { gender } : undefined,
      },
      include: {
        group: { select: { name: true } },
        soloist: { select: { name: true } },
      },
    });

    if (!song) return;

    try {
      const {
        data: { video },
      } = (await axios.get(`${process.env.YURE_URL}/song?id=${song.id}`)) as {
        data: { video: string };
      };

      const instance: RedisSong = { ...song, video: video };

      if (addToStack) {
        await redis.rpush(
          `gts:songs:${gender?.toLowerCase() || "all"}`,
          JSON.stringify(instance)
        );
      }

      return instance;
    } catch (e) {
      console.log(e);
      console.log(
        `error occurred with song id ${song.id}, adding to bad songs...`
      );
      this.badSongs.push(song.id);
      return;
    }
  }

  public async clearSongQueues({ redis }: Context): Promise<void> {
    await redis.del("gts:songs:all");
    await redis.del("gts:songs:male");
    await redis.del("gts:songs:female");
    await redis.del("gts:songs:coed");
    return;
  }
}

export const gts = new GTSManager();
