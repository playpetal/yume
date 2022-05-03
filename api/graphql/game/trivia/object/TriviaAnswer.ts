import { Trivia } from "@prisma/client";
import { nonNull, objectType } from "nexus";
import { TriviaAnswer } from "nexus-prisma";

export const TriviaAnswerObject = objectType({
  name: TriviaAnswer.$name,
  description: TriviaAnswer.$description,
  definition(t) {
    t.field(TriviaAnswer.id);

    t.field(TriviaAnswer.triviaId);
    t.field("trivia", {
      type: nonNull("Trivia"),
      async resolve({ triviaId }, _, ctx) {
        const trivia: Trivia = (await ctx.db.trivia.findFirst({
          where: { id: triviaId },
        }))!;

        return trivia;
      },
    });

    t.field(TriviaAnswer.answer);
    t.field(TriviaAnswer.correct);
  },
});
