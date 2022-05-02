import { nonNull, objectType } from "nexus";
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
        const group = await ctx.db.group.findFirst({ where: { id: groupId } });

        return group!;
      },
    });

    t.field(Trivia.question);
    t.field(Trivia.solution);
  },
});
