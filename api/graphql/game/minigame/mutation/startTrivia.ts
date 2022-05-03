import { Bias, Group, Trivia, TriviaAnswer } from "@prisma/client";
import { extendType, nonNull } from "nexus";
import { Minigame } from "yume";
import { auth } from "../../../../lib/Auth";
import { UserFacingError } from "../../../../lib/error";
import { MinigameNotImplementedError } from "../../../../lib/error/minigame";
import { hasFlag } from "../../../../lib/flags";
import { getMinigame } from "../../../../lib/minigame/redis/getMinigame";
import { setMinigame } from "../../../../lib/minigame/redis/setMinigame";
import { rulesets } from "../../../../lib/minigame/rulesets";
import { getTriviaQuestion } from "../../../../lib/minigame/trivia/getTriviaQuestion";

export const startTrivia = extendType({
  type: "Mutation",
  definition(t) {
    t.field("startTrivia", {
      type: nonNull("TriviaMinigame"),
      description: "Starts a new instance of the 'Trivia' minigame.",
      args: {
        gender: "GroupGender",
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
          throw new UserFacingError("you're playing a minigame already!");

        const ruleset = rulesets.TRIVIA;
        if (!ruleset) throw new MinigameNotImplementedError();

        let biasList: Bias[] | undefined;
        if (hasFlag("MINIGAMES_USE_BIAS_LIST", account.flags)) {
          biasList = await ctx.db.bias.findMany({
            where: { accountId: account.id },
          });
        }

        const question: Trivia & {
          group: Group;
          solutions: TriviaAnswer[];
        } = await getTriviaQuestion(ctx, {
          gender: gender ?? undefined,
          group: group ?? undefined,
          biasList,
        });

        const minigame: Minigame<"TRIVIA"> = {
          type: "TRIVIA",
          accountId: account.id,
          attempts: [],
          maxAttempts: ruleset.maxAttempts,
          startedAt: Date.now(),
          state: "PLAYING",
          timeLimit: ruleset.timeLimit,
          messageId: messageId ?? undefined,
          channelId: channelId ?? undefined,
          guildId: guildId ?? undefined,
          group: question.group,
          question: question.question,
          answer: question.solutions.find((s) => s.correct)!.answer,
          options: question.solutions.map((s) => s.answer),
        };

        await setMinigame(minigame);

        return { ...minigame, answer: null, group: question.group.name };
      },
    });
  },
});
