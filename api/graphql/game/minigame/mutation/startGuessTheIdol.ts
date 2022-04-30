import { extendType, nonNull } from "nexus";
import { Minigame } from "yume";
import { auth } from "../../../../lib/Auth";
import { MinigameNotImplementedError } from "../../../../lib/error/minigame";
import { getRandomCharacter } from "../../../../lib/getRandomCharacter";
import { getMinigame } from "../../../../lib/minigame/redis/getMinigame";
import { setMinigame } from "../../../../lib/minigame/redis/setMinigame";
import { rulesets } from "../../../../lib/minigame/rulesets";

export const startGuessTheIdol = extendType({
  type: "Mutation",
  definition(t) {
    t.field("startGuessTheIdol", {
      type: nonNull("GuessTheIdol"),
      description: "Starts a new instance of the 'Guess The Song' minigame.",
      args: {
        gender: "Gender",
        group: "String",
        /* discord */
        messageId: "String",
        channelId: "String",
        guildId: "String",
      },
      async resolve(_, { gender, group, messageId, channelId, guildId }, ctx) {
        const account = await auth(ctx);

        const activeMinigame = await getMinigame(account.id);
        if (
          activeMinigame &&
          (activeMinigame.state === "PLAYING" ||
            activeMinigame.state === "PENDING") &&
          activeMinigame.startedAt >= Date.now() - activeMinigame.timeLimit
        )
          throw new Error("You're playing a minigame already");

        const ruleset = rulesets.GUESS_THE_IDOL;
        if (!ruleset) throw new MinigameNotImplementedError();

        const character = await getRandomCharacter(ctx, {
          gender: gender ?? undefined,
          group: group ?? undefined,
        });

        const minigame: Minigame<"GUESS_THE_IDOL"> = {
          type: "GUESS_THE_IDOL",
          accountId: account.id,
          attempts: [],
          maxAttempts: ruleset.maxAttempts,
          startedAt: Date.now(),
          state: "PLAYING",
          timeLimit: ruleset.timeLimit,
          messageId: messageId ?? undefined,
          channelId: channelId ?? undefined,
          guildId: guildId ?? undefined,
          character,
        };

        await setMinigame(minigame);

        return { ...minigame, character: null };
      },
    });
  },
});
