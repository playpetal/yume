import { extendType, list, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";
import { AuthenticationError, UserFacingError } from "../../../../lib/error";
import { hasFlag } from "../../../../lib/flags";

export const createTriviaQuestion = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createTriviaQuestion", {
      type: nonNull("Trivia"),
      args: {
        question: nonNull("String"),
        solution: nonNull("String"),
        incorrectAnswers: nonNull(list(nonNull("String"))),
        groupId: nonNull("Int"),
      },
      async resolve(_, { question, solution, incorrectAnswers, groupId }, ctx) {
        const account = await auth(ctx);
        if (!hasFlag("GAME_DESIGNER", account.flags))
          throw new AuthenticationError(
            "you don't have permission to do that."
          );

        if (incorrectAnswers.length !== 3)
          throw new UserFacingError(
            "you must specify exactly three incorrect answers."
          );

        const trivia = await ctx.db.trivia.create({
          data: { groupId, question },
        });

        await ctx.db.triviaAnswer.createMany({
          data: [
            { answer: solution, correct: true, triviaId: trivia.id },
            ...incorrectAnswers.map((a) => {
              return { answer: a, correct: false, triviaId: trivia.id };
            }),
          ],
        });

        return trivia;
      },
    });
  },
});
