import { MinigameType } from "@prisma/client";
import { extendType, nonNull } from "nexus";
import { Minigame, UnknownMinigameData } from "yume";
import { auth } from "../../../../lib/Auth";
import { canClaimRewards } from "../../../../lib/game";
import { destroyMinigame } from "../../../../lib/minigame/destroyMinigame";
import { rulesets } from "../../../../lib/minigame/rulesets";
import { redis } from "../../../../lib/redis";

export const answerMinigame = extendType({
  type: "Mutation",
  definition(t) {
    t.field("answerMinigame", {
      type: "Minigame",
      args: {
        answer: nonNull("String"),
      },
      async resolve(_, { answer }, ctx) {
        const account = await auth(ctx);

        const _minigame = await redis.get(`minigame:${account.id}`);

        if (!_minigame) throw new Error("Not playing minigame");

        const minigame = JSON.parse(_minigame) as Minigame<MinigameType>;
        const { data } = minigame;

        if (data.correct) throw new Error("Already correctly answered");

        const ruleset = rulesets[data.type]!;

        const startedAt = new Date(data.startedAt);

        if (startedAt.getTime() < Date.now() - ruleset.timeLimit) {
          await redis.del(`minigame:${account.id}`);
          throw new Error("Not playing minigame");
        }

        data.attempts += 1;
        data.startedAt = new Date(data.startedAt);

        if (data.type === "GTS") {
          if (data.answer.title === answer) data.correct = true;
        } else if (data.type === "GUESS_CHARACTER") {
          if (data.answer.name === answer) data.correct = true;
        } else if (data.type === "WORDS") {
        }

        const canClaim = await canClaimRewards(ctx, account);
        const shouldDestroy =
          canClaim === 0 ||
          (data.attempts >= ruleset.maxAttempts && !data.correct);

        if (shouldDestroy) {
          await destroyMinigame(ctx, account, data, {
            type: "PETAL",
            amount: 1,
          });

          if (data.correct) {
            await ctx.db.account.update({
              where: { id: account.id },
              data: { currency: { increment: 1 } },
            });
          }
        } else {
          await redis.set(`minigame:${account.id}`, JSON.stringify(minigame));
        }

        return minigame as {
          accountId: number;
          type: MinigameType;
          messageId: string;
          channelId: string;
          guildId: string;
          data: UnknownMinigameData;
        };
      },
    });
  },
});

/*
mutation($type: MinigameType!){
  startMinigame(type: $type) {
    accountId
    messageId
    channelId
    guildId
    type
    data {
      attempts
      elapsed
      type
      isGendered
      startedAt
      correct
    }
  }
}

mutation($answer: String!){
  answerMinigame(answer: $answer) {
    accountId
    messageId
    channelId
    guildId
    type
    data {
      attempts
      elapsed
      type
      isGendered
      startedAt
      correct
    }
  }
}

*/
