import { extendType } from "nexus";
import { GuessTheSongMinigame } from "yume";
import { auth } from "../../../../lib/Auth";
import { getMinigame } from "../../../../lib/minigame/redis/getMinigame";
import { setMinigame } from "../../../../lib/minigame/redis/setMinigame";

export const getGuessTheSong = extendType({
  type: "Query",
  definition(t) {
    t.field("getGuessTheSong", {
      type: "GuessTheSong",
      async resolve(_, __, ctx) {
        const account = await auth(ctx);

        const minigame = await getMinigame(account.id);
        if (!minigame) return null;

        let expired =
          minigame.state === "PLAYING" &&
          (minigame.attempts.length >= minigame.maxAttempts ||
            Date.now() - minigame.startedAt.getTime() >= minigame.timeLimit);

        if (expired) {
          minigame.state = "FAILED";
          await setMinigame(minigame);
        }

        if (minigame.state === "PLAYING") {
          (minigame as GuessTheSongMinigame<false>).song = null;
        }

        return minigame;
      },
    });
  },
});
