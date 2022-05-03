import { MinigameType } from "@prisma/client";
import { extendType } from "nexus";
import { Minigame } from "yume";
import { auth } from "../../../../lib/Auth";
import { PlayingOtherMinigameError } from "../../../../lib/error/minigame";
import { getMinigame } from "../../../../lib/minigame/redis/getMinigame";
import { setMinigame } from "../../../../lib/minigame/redis/setMinigame";
import { isTrivia } from "../../../../lib/minigame/util/typeguards/isTrivia";

export const getTrivia = extendType({
  type: "Query",
  definition(t) {
    t.field("getTrivia", {
      type: "TriviaMinigame",
      async resolve(_, __, ctx) {
        const account = await auth(ctx);

        let minigame: Minigame<MinigameType> | null = await getMinigame(
          account.id
        );
        if (!minigame) return null;

        if (!isTrivia(minigame)) throw new PlayingOtherMinigameError();

        let expired =
          minigame.state === "PLAYING" &&
          (minigame.attempts.length >= minigame.maxAttempts ||
            Date.now() - minigame.startedAt >= minigame.timeLimit);

        if (expired) {
          minigame.state = "FAILED";
          await setMinigame(minigame);
        }

        let answer: string | null = minigame.answer;

        if (minigame.state === "PLAYING") {
          answer = null;
        }

        return { ...minigame, answer, group: minigame.group?.name! };
      },
    });
  },
});
