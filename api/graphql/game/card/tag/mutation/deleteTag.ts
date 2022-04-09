import { extendType, nonNull } from "nexus";
import { auth } from "../../../../../lib/Auth";
import { NotFoundError } from "../../../../../lib/error";

export const deleteTag = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteTag", {
      type: nonNull("Tag"),
      args: { tag: nonNull("String") },
      async resolve(_, { tag }, ctx) {
        const account = await auth(ctx);

        const targetTag = await ctx.db.tag.findFirst({
          where: {
            accountId: account.id,
            tag: { equals: tag, mode: "insensitive" },
          },
        });

        if (!targetTag)
          throw new NotFoundError("you don't have any tags with that name.");

        await ctx.db.tag.delete({ where: { id: targetTag.id } });

        return targetTag;
      },
    });
  },
});
