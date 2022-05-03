import { Group, TriviaAnswer } from "@prisma/client";
import { list, nonNull, objectType } from "nexus";
import { Trivia } from "nexus-prisma";

export const TriviaObject = objectType({
  name: Trivia.$name,
  description: Trivia.$description,
  definition(t) {
    t.field(Trivia.id);

    t.field(Trivia.groupId);
    t.field("group", {
      type: nonNull("Group"),
      async resolve({ groupId }, _, ctx) {
        const group: Group = (await ctx.db.group.findFirst({
          where: { id: groupId },
        }))!;

        return group;
      },
    });

    t.field(Trivia.question);

    t.field("solutions", {
      type: nonNull(list(nonNull("TriviaAnswer"))),
      async resolve({ id }, _, ctx) {
        const solutions: TriviaAnswer[] = await ctx.db.triviaAnswer.findMany({
          where: { triviaId: id },
        });

        return solutions;
      },
    });
  },
});
