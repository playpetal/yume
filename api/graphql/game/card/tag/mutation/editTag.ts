import { extendType, nonNull } from "nexus";
import { auth } from "../../../../../lib/Auth";
import Emoji from "node-emoji";
import { InvalidInputError, NotFoundError } from "../../../../../lib/error";

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
          throw new NotFoundError("you don't have any tags with that name.");

        if (name) {
          const nameIsInvalid = name.match(/[^a-z0-9]/gim);

          if (nameIsInvalid)
            throw new InvalidInputError(
              "tag names may only contain alphanumeric characters!"
            );

          if (name.length > 15 || name.length < 1)
            throw new InvalidInputError(
              "tag names may only be 1-15 characters long!"
            );
        }

        if (emoji) {
          const isUnicodeEmoji = Emoji.find(emoji);

          if (!isUnicodeEmoji) {
            const isCustomEmoji =
              emoji.match(/(<a?)?:\w+:(\d{18}>)?/g) !== null;

            if (!isCustomEmoji)
              throw new InvalidInputError(
                "emojis must be either Emoji 13.1 or custom Discord emoji!"
              );
          }
        }

        const _tag = await ctx.db.tag.update({
          where: { id: targetTag.id },
          data: { tag: name ?? undefined, emoji: emoji ?? undefined },
        });

        return _tag;
      },
    });
  },
});
