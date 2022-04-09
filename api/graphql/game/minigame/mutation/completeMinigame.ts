import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";
import { canClaimRewards } from "../../../../lib/game";
import { upsertMinigameStats } from "../../../../lib/minigame/upsertMinigameStats";

export const completeMinigame = extendType({
  type: "Mutation",
  definition(t) {
    t.field("completeMinigame", {
      type: nonNull("Boolean"),
      args: {
        type: nonNull("MinigameType"),
        reward: nonNull("Reward"),
        guesses: nonNull("Int"),
        time: nonNull("Int"),
      },
      async resolve(_, { type, reward, guesses, time }, ctx) {
        const account = await auth(ctx);

        const rewards = await canClaimRewards(ctx);
        let petalAmount = 5;

        if (rewards <= 0) petalAmount = 1;

        await upsertMinigameStats(
          ctx,
          type,
          account,
          { type: reward, amount: reward === "PETAL" ? petalAmount : 1 },
          1,
          guesses,
          time
        );

        return true;
      },
    });
  },
});
