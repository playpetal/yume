import { Character } from "@prisma/client";
import { extendType, nonNull } from "nexus";
import { GameSong, Minigame, UnknownMinigameData } from "yume";
import { auth } from "../../../../lib/Auth";
import { getWord } from "../../../../lib/game/words";
import { getRandomCharacter } from "../../../../lib/getRandomCharacter";
import { gts } from "../../../../lib/gts";
import { createMinigameData } from "../../../../lib/minigame/createMinigameData";
import { rulesets } from "../../../../lib/minigame/rulesets";
import { redis } from "../../../../lib/redis";

export const startMinigame = extendType({
  type: "Mutation",
  definition(t) {
    t.field("startMinigame", {
      type: "Minigame",
      args: {
        type: nonNull("MinigameType"),
        gender: "Gender",
        groupGender: "GroupGender",
        messageId: "String",
        channelId: "String",
        guildId: "String",
      },
      async resolve(
        _,
        { type, gender, groupGender, messageId, channelId, guildId },
        ctx
      ) {
        const account = await auth(ctx);

        const minigameExists = await redis.get(`minigame:${account.id}`);

        if (minigameExists) {
          const { data } = JSON.parse(minigameExists) as Minigame<any>;
          const startedAt = new Date(data.startedAt);

          const ruleset = rulesets[data.type]!;

          if (startedAt.getTime() >= Date.now() - ruleset.timeLimit) {
            throw new Error("Minigame is already being played");
          } else {
            await redis.del(`minigame:${account.id}`);
          }
        }

        const ruleset = rulesets[type];
        if (!ruleset) throw new Error("Minigame not yet implemented");

        let answer: string | GameSong | Character;

        if (type === "GTS") {
          const song = await gts.getSong(ctx, groupGender ?? undefined);

          if (!song) return null;

          answer = song;
        } else if (type === "GUESS_CHARACTER") {
          answer = await getRandomCharacter(ctx, gender ?? undefined);
        } else if (type === "WORDS") {
          answer = getWord();
        } else {
          throw new Error("Minigame not yet implemented");
        }

        let data: UnknownMinigameData = createMinigameData({
          answer,
          type,
          isGendered: !!gender || !!groupGender,
        });

        const minigame = {
          type,
          accountId: account.id,
          messageId,
          channelId,
          guildId,
          data,
        };

        await redis.set(`minigame:${account.id}`, JSON.stringify(minigame));

        return minigame;
      },
    });
  },
});
