import { MinigameType } from "@prisma/client";
import { extendType } from "nexus";
import { Minigame, MinigameSong } from "yume";
import { auth } from "../../../../lib/Auth";
import { NotPlayingGTSError } from "../../../../lib/error/minigame/guessTheSong";
import { getMinigame } from "../../../../lib/minigame/redis/getMinigame";
import { setMinigame } from "../../../../lib/minigame/redis/setMinigame";
import { isGuessTheSong } from "../../../../lib/minigame/util/typeguards/isGuessTheSong";

export const getGuessTheSong = extendType({
  type: "Query",
  definition(t) {
    t.field("getGuessTheSong", {
      type: "GuessTheSong",
      async resolve(_, __, ctx) {
        const account = await auth(ctx);

        let minigame: Minigame<MinigameType> | null = await getMinigame(
          account.id
        );
        if (!minigame) return null;

        if (!isGuessTheSong(minigame))
          throw new NotPlayingGTSError("you're not playing guess-the-song!");

        let expired =
          minigame.state === "PLAYING" &&
          (minigame.attempts.length >= minigame.maxAttempts ||
            Date.now() - minigame.startedAt.getTime() >= minigame.timeLimit);

        if (expired) {
          minigame.state = "FAILED";
          await setMinigame(minigame);
        }

        let song: MinigameSong | null = minigame.song;

        if (minigame.state === "PLAYING") {
          song = null;
        }

        return { ...minigame, song };
      },
    });
  },
});
