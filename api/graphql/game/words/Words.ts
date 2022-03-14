import { extendType, nonNull } from "nexus";
import { auth } from "../../../lib/Auth";
import { getWord, wordIsValid } from "../../../lib/game/words";

export const GetWord = extendType({
  type: "Query",
  definition(t) {
    t.field("word", {
      type: nonNull("String"),
      async resolve(_, __, ctx) {
        await auth(ctx);
        return getWord();
      },
    });
  },
});

export const WordIsValid = extendType({
  type: "Query",
  definition(t) {
    t.field("isWordValid", {
      type: nonNull("Boolean"),
      args: {
        word: nonNull("String"),
      },
      async resolve(_, { word }) {
        return wordIsValid(word);
      },
    });
  },
});

export const CompleteWords = extendType({
  type: "Mutation",
  definition(t) {
    t.field("completeWords", {
      type: nonNull("Boolean"),
      args: {
        reward: nonNull("Reward"),
        words: nonNull("Int"),
        time: nonNull("Int"),
      },
      async resolve(_, { reward, words, time }, ctx) {
        const account = await auth(ctx);

        await ctx.db.words.upsert({
          where: { accountId: account.id },
          create: {
            accountId: account.id,
            totalGames: 1,
            totalWords: words,
            totalTime: time,
            totalCurrency: reward === "CARD" ? 5 : undefined,
            totalCards: reward === "PETAL" ? 1 : undefined,
            totalPremiumCurrency: reward === "LILY" ? 1 : undefined,
          },
          update: {
            totalGames: { increment: 1 },
            totalWords: { increment: words },
            totalTime: { increment: time },
            totalCurrency: reward === "PETAL" ? { increment: 5 } : undefined,
            totalCards: reward === "CARD" ? { increment: 1 } : undefined,
            totalPremiumCurrency:
              reward === "LILY" ? { increment: 1 } : undefined,
          },
        });

        return true;
      },
    });
  },
});
