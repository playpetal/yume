import { extendType, nonNull } from "nexus";
import { Minigame } from "yume";
import { auth } from "../../../../lib/Auth";
import { MinigameNotImplementedError } from "../../../../lib/error/minigame";
import { gts } from "../../../../lib/gts";
import { getMinigame } from "../../../../lib/minigame/redis/getMinigame";
import { setMinigame } from "../../../../lib/minigame/redis/setMinigame";
import { rulesets } from "../../../../lib/minigame/rulesets";

export const startGuessTheSong = extendType({
  type: "Mutation",
  definition(t) {
    t.field("startGuessTheSong", {
      type: nonNull("GuessTheSong"),
      description: "Starts a new instance of the 'Guess The Song' minigame.",
      args: {
        gender: "GroupGender",
        group: "Int",
        /* discord */
        messageId: "String",
        channelId: "String",
        guildId: "String",
      },
      async resolve(_, { gender, messageId, channelId, guildId }, ctx) {
        const account = await auth(ctx);

        const activeMinigame = await getMinigame(account.id);
        if (
          activeMinigame &&
          (activeMinigame.state === "PLAYING" ||
            activeMinigame.state === "PENDING") &&
          activeMinigame.startedAt >= Date.now() - activeMinigame.timeLimit
        )
          throw new Error("You're playing a minigame already");

        const ruleset = rulesets.GUESS_THE_SONG;
        if (!ruleset) throw new MinigameNotImplementedError();

        const song = await gts.getSong(ctx, gender ?? undefined);
        if (!song) throw new Error("No songs");

        const minigame: Minigame<"GUESS_THE_SONG"> = {
          type: "GUESS_THE_SONG",
          accountId: account.id,
          attempts: [],
          maxAttempts: ruleset.maxAttempts,
          song: { title: song.title, group: song.group, soloist: song.soloist },
          startedAt: Date.now(),
          state: "PLAYING",
          timeLimit: ruleset.timeLimit,
          video: undefined,
          messageId: messageId ?? undefined,
          channelId: channelId ?? undefined,
          guildId: guildId ?? undefined,
        };

        await setMinigame(minigame);

        return { ...minigame, song: null, video: song.video };
      },
    });
  },
});
