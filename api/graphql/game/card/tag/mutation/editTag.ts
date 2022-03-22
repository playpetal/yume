import { UserInputError } from "apollo-server";
import { extendType, nonNull } from "nexus";
import { auth } from "../../../../../lib/Auth";

export const editTag = extendType({
  type: "Mutation",
  definition(t) {
    t.field("editTag", {
      type: nonNull("Tag"),
      args: { tag: nonNull("String"), name: "String", emoji: "String" },
      async resolve(_, { tag, name, emoji }, ctx) {
        const account = await auth(ctx);

        const targetTag = await ctx.db.tag.findFirst({
          where: {
            accountId: account.id,
            tag: { equals: tag, mode: "insensitive" },
          },
        });

        if (!targetTag)
          throw new UserInputError("you don't have a tag by that name.");

        const _tag = await ctx.db.tag.update({
          where: { id: targetTag.id },
          data: { tag: name ?? undefined, emoji: emoji ?? undefined },
        });

        return _tag;
      },
    });
  },
});
