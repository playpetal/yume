import { Character, MinigameType } from "@prisma/client";
import { extendType } from "nexus";
import { Minigame } from "yume";
import { auth } from "../../../../lib/Auth";
import { PlayingOtherMinigameError } from "../../../../lib/error/minigame";
import { getMinigame } from "../../../../lib/minigame/redis/getMinigame";
import { setMinigame } from "../../../../lib/minigame/redis/setMinigame";
import { isGuessTheIdol } from "../../../../lib/minigame/util/typeguards/isGuessTheIdol";

export const getGuessTheIdol = extendType({
  type: "Query",
  definition(t) {
    t.field("getGuessTheIdol", {
      type: "GuessTheIdol",
      async resolve(_, __, ctx) {
        const account = await auth(ctx);

        let minigame: Minigame<MinigameType> | null = await getMinigame(
          account.id
        );
        if (!minigame) return null;

        if (!isGuessTheIdol(minigame)) throw new PlayingOtherMinigameError();

        let expired =
          minigame.state === "PLAYING" &&
          (minigame.attempts.length >= minigame.maxAttempts ||
            Date.now() - minigame.startedAt >= minigame.timeLimit);

        if (expired) {
          minigame.state = "FAILED";
          await setMinigame(minigame);
        }

        let character: Character | null = minigame.character;

        if (minigame.state === "PLAYING") {
          character = null;
        }

        return { ...minigame, character };
      },
    });
  },
});
