import { Card, MinigameType } from "@prisma/client";
import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";
import { roll } from "../../../../lib/card";
import {
  AllPremiumRewardsClaimedError,
  AllRewardsClaimedError,
  MinigameNotImplementedError,
  NoRewardsPendingError,
  RewardsAlreadyClaimedError,
} from "../../../../lib/error/minigame";
import { canClaimPremiumCurrency, canClaimRewards } from "../../../../lib/game";
import { modifyCurrency } from "../../../../lib/game/economy/modifyCurrency";
import { modifyPremiumCurrency } from "../../../../lib/game/economy/modifyPremiumCurrency";
import { claim, claimPremium } from "../../../../lib/minigame/claim";
import { getMinigame } from "../../../../lib/minigame/redis/getMinigame";
import { setMinigame } from "../../../../lib/minigame/redis/setMinigame";
import { rulesets } from "../../../../lib/minigame/rulesets";
import { upsertMinigameStats } from "../../../../lib/minigame/upsertMinigameStats";

export const completeMinigame = extendType({
  type: "Mutation",
  definition(t) {
    t.field("completeMinigame", {
      type: nonNull("MinigameReward"),
      description: "Claims a reward from a `PENDING` minigame.",
      args: { reward: nonNull("Reward") },
      async resolve(_, { reward }, ctx) {
        const account = await auth(ctx);

        const minigame = await getMinigame<MinigameType>(account.id);

        if (!minigame || minigame.state !== "PENDING") {
          if (minigame?.state === "COMPLETED")
            throw new RewardsAlreadyClaimedError(
              "you've already claimed rewards for this minigame!"
            );

          throw new NoRewardsPendingError();
        }

        const isEligible = await canClaimRewards(ctx, account);
        if (isEligible <= 0) throw new AllRewardsClaimedError();

        const ruleset = rulesets.GUESS_THE_IDOL;
        if (!ruleset) throw new MinigameNotImplementedError();

        if (reward === "LILY") {
          const isPremiumEligible = await canClaimPremiumCurrency(account, ctx);
          if (isPremiumEligible <= 0) throw new AllPremiumRewardsClaimedError();

          await claimPremium(ctx, account, isEligible, isPremiumEligible);
        } else {
          await claim(ctx, account, isEligible);
        }

        minigame.state = "COMPLETED";
        await setMinigame(minigame);

        let card: Card | null = null;
        let amount = 5;

        if (reward === "CARD") {
          amount = 1;
          [card] = await roll(ctx, { amount: 1, free: true });
        } else if (reward === "PETAL") {
          await modifyCurrency(ctx, account, 5);
        } else if (reward === "LILY") {
          await modifyPremiumCurrency(ctx, account, 1);
        }

        await upsertMinigameStats(
          ctx,
          minigame.type,
          account,
          { type: reward, amount: amount },
          1,
          minigame.attempts.length,
          minigame.elapsed!
        );

        return { card, account };
      },
    });
  },
});
