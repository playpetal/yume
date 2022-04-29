import { extendType, nonNull } from "nexus";
import { GuessTheSongMinigame } from "yume";
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
          activeMinigame.startedAt.getTime() >=
            Date.now() - activeMinigame.timeLimit
        )
          throw new Error("You're playing a minigame already");

        const ruleset = rulesets.GTS;
        if (!ruleset) throw new MinigameNotImplementedError();

        const song = await gts.getSong(ctx, gender ?? undefined);
        if (!song) throw new Error("No songs");

        const minigame: GuessTheSongMinigame<boolean> = {
          type: "GTS",
          accountId: account.id,
          attempts: [],
          maxAttempts: ruleset.maxAttempts,
          song: { title: song.title, group: song.group, soloist: song.soloist },
          startedAt: new Date(),
          state: "PLAYING",
          timeLimit: ruleset.timeLimit,
          video: song.video,
          messageId: messageId ?? undefined,
          channelId: channelId ?? undefined,
          guildId: guildId ?? undefined,
        };

        await setMinigame(minigame);

        (minigame as GuessTheSongMinigame<false>).song = null;

        return minigame;
      },
    });
  },
});
