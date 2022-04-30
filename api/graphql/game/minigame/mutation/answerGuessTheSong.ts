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
import { findBestMatch } from "../../../../lib/minigame/util/compareStrings";
import { isGuessTheSong } from "../../../../lib/minigame/util/typeguards/isGuessTheSong";

export const answerGuessTheSong = extendType({
  type: "Mutation",
  definition(t) {
    t.field("answerGuessTheSong", {
      type: nonNull("GuessTheSong"),
      description: "Submits an answer to a 'Guess The Song' minigame.",
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
            throw new NotPlayingMinigameError("guess-the-song");

          if (minigame.state === "PENDING")
            throw new RewardsPendingError(
              "you have rewards pending! claim them to start a new minigame."
            );
        }

        if (!isGuessTheSong(minigame)) throw new PlayingOtherMinigameError();

        const ruleset = rulesets.GUESS_THE_SONG;
        if (!ruleset) throw new MinigameNotImplementedError();

        minigame.attempts.push({ title: answer });

        const candidates: string[] = [minigame.song.title];
        if (minigame.song.group)
          candidates.push(`${minigame.song.group} - ${minigame.song.title}`);
        if (minigame.song.soloist)
          candidates.push(`${minigame.song.soloist} - ${minigame.song.title}`);

        const { rating } = findBestMatch(answer, candidates);

        if (rating >= 0.8) {
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
              "GTS",
              account,
              { type: "PETAL", amount: 1 },
              1,
              minigame.attempts.length,
              minigame.elapsed
            );

            minigame.state = "COMPLETED";
          }
        }

        await setMinigame(minigame);

        return minigame;
      },
    });
  },
});
