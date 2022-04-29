import { extendType, nonNull } from "nexus";
import { GuessTheSongMinigame } from "yume";
import { auth } from "../../../../lib/Auth";
import { MinigameNotImplementedError } from "../../../../lib/error/minigame";
import {
  NotPlayingGTSError,
  RewardsPendingError,
} from "../../../../lib/error/minigame/guessTheSong";
import { canClaimRewards } from "../../../../lib/game";
import { getMinigame } from "../../../../lib/minigame/redis/getMinigame";
import { setMinigame } from "../../../../lib/minigame/redis/setMinigame";
import { rulesets } from "../../../../lib/minigame/rulesets";
import { upsertMinigameStats } from "../../../../lib/minigame/upsertMinigameStats";
import { findBestMatch } from "../../../../lib/minigame/util/compareStrings";

export const answerGuessTheSong = extendType({
  type: "Mutation",
  definition(t) {
    t.field("answerGuessTheSong", {
      type: nonNull("GuessTheSong"),
      description: "Submits an answer to a 'Guess The Song' minigame.",
      args: { answer: nonNull("String") },
      async resolve(_, { answer }, ctx) {
        const account = await auth(ctx);

        const minigame: GuessTheSongMinigame<true> | null = await getMinigame(
          account.id
        );

        if (!minigame || minigame.state !== "PLAYING") {
          if (
            !minigame ||
            minigame.state === "FAILED" ||
            minigame.state === "CANCELLED" ||
            minigame.state === "COMPLETED"
          )
            throw new NotPlayingGTSError("you're not playing guess-the-song!");

          if (minigame.state === "PENDING")
            throw new RewardsPendingError(
              "you have rewards pending! claim them to start a new minigame."
            );

          if (minigame.type !== "GTS")
            throw new NotPlayingGTSError(
              "you're currently playing a different minigame!"
            );
        }

        const ruleset = rulesets.GTS;
        if (!ruleset) throw new MinigameNotImplementedError();

        minigame.attempts.push({ title: answer });

        const candidates: string[] = [minigame.song!.title];
        if (minigame.song!.group)
          candidates.push(`${minigame.song!.group} - ${minigame.song!.title}`);
        if (minigame.song!.soloist)
          candidates.push(`${minigame.song!.soloist} - ${minigame.song.title}`);

        const { rating } = findBestMatch(answer, candidates);

        if (rating >= 0.8) {
          minigame.elapsed = Date.now() - minigame.startedAt.getTime();

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
