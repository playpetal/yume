import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";
import { redis } from "../../../../lib/redis";

export const updateMinigameMessage = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateMinigameMessage", {
      type: nonNull("Boolean"),
      args: {
        messageId: nonNull("String"),
        channelId: nonNull("String"),
        guildId: nonNull("String"),
      },
      async resolve(_, { messageId, channelId, guildId }, ctx) {
        const account = await auth(ctx);

        const _minigame = await redis.get(`minigame:${account.id}`);
        if (!_minigame) throw new Error("Not playing minigame");

        const minigame = JSON.parse(_minigame) as any;
        minigame.messageId = messageId;
        minigame.channelId = channelId;
        minigame.guildId = guildId;

        await redis.set(`minigame:${account.id}`, JSON.stringify(minigame));
        return true;
      },
    });
  },
});
