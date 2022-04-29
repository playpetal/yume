import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";
import { redis } from "../../../../lib/redis";

export const cancelMinigame = extendType({
  type: "Mutation",
  definition(t) {
    t.field("cancelMinigame", {
      type: nonNull("Boolean"),
      async resolve(_, __, ctx) {
        const account = await auth(ctx);

        const _minigame = await redis.get(`minigame:${account.id}`);
        if (!_minigame) throw new Error("Not playing minigame");

        await redis.del(`minigame:${account.id}`);
        return true;
      },
    });
  },
});
