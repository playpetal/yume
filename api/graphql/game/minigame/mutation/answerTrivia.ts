import { MinigameType } from "@prisma/client";
import { extendType, nonNull } from "nexus";
import { Minigame } from "yume";
import { auth } from "../../../../lib/Auth";
import {
  MinigameNotImplementedError,
  NotPlayingMinigameError,
  PlayingOtherMinigameError,
  RewardsPendingError,
} from "../../../../lib/error/minigame";
import { canClaimRewards } from "../../../../lib/game";
import { getMinigame } from "../../../../lib/minigame/redis/getMinigame";
import { setMinigame } from "../../../../lib/minigame/redis/setMinigame";
import { rulesets } from "../../../../lib/minigame/rulesets";
import { upsertMinigameStats } from "../../../../lib/minigame/upsertMinigameStats";
import { isTrivia } from "../../../../lib/minigame/util/typeguards/isTrivia";

export const answerTrivia = extendType({
  type: "Mutation",
  definition(t) {
    t.field("answerTrivia", {
      type: nonNull("TriviaMinigame"),
      description: "Submits an answer to a 'Trivia' minigame.",
      args: { answer: nonNull("String") },
      async resolve(_, { answer }, ctx) {
        const account = await auth(ctx);

        const minigame: Minigame<MinigameType> | null = await getMinigame(
          account.id
        );

        if (!minigame || minigame.state !== "PLAYING") {
          if (
            !minigame ||
            minigame.state === "FAILED" ||
            minigame.state === "CANCELLED" ||
            minigame.state === "COMPLETED"
          )
            throw new NotPlayingMinigameError("trivia");

          if (minigame.state === "PENDING")
            throw new RewardsPendingError(
              "you have rewards pending! claim them to start a new minigame."
            );
        }

        if (!isTrivia(minigame)) throw new PlayingOtherMinigameError();

        const ruleset = rulesets.TRIVIA;
        if (!ruleset) throw new MinigameNotImplementedError();

        let _answer: string | null = minigame.answer;

        if (answer.toLowerCase() === minigame.answer.toLowerCase()) {
          minigame.elapsed = Date.now() - minigame.startedAt;

          const canClaim = await canClaimRewards(ctx, account);

          if (canClaim > 0) {
            minigame.state = "PENDING";
          } else {
            await ctx.db.account.update({
              where: { id: account.id },
              data: { currency: { increment: 1 } },
            });

            await upsertMinigameStats(
              ctx,
              "TRIVIA",
              account,
              { type: "PETAL", amount: 1 },
              1,
              minigame.attempts.length,
              minigame.elapsed
            );

            minigame.state = "COMPLETED";
          }
        } else {
          minigame.state = "FAILED";
        }

        await setMinigame(minigame);

        return { ...minigame, answer: _answer, group: minigame.group!.name };
      },
    });
  },
});
