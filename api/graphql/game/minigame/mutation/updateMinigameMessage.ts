import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";
import { getMinigame } from "../../../../lib/minigame/redis/getMinigame";
import { setMinigame } from "../../../../lib/minigame/redis/setMinigame";

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

        const minigame = await getMinigame(account.id);
        if (!minigame) throw new Error("Not playing minigame");

        minigame.messageId = messageId;
        minigame.channelId = channelId;
        minigame.guildId = guildId;

        await setMinigame(minigame);
        return true;
      },
    });
  },
});
