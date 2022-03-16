import { UserInputError } from "apollo-server";
import { extendType, list, nonNull, objectType } from "nexus";
import { Tag } from "nexus-prisma";
import { auth } from "../../../../lib/Auth";
import Emoji from "node-emoji";

export const objTag = objectType({
  name: Tag.$name,
  description: Tag.$description,
  definition(t) {
    t.field(Tag.id);

    t.field(Tag.accountId);
    t.field("account", {
      type: nonNull("Account"),
      async resolve(parent, _, ctx) {
        const account = await ctx.db.account.findFirst({
          where: { id: parent.accountId },
        });

        return account!;
      },
    });

    t.field(Tag.emoji);
    t.field(Tag.tag);

    t.field(Tag.updatedAt);
  },
});

export const mutCreateTag = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createTag", {
      type: nonNull("Tag"),
      args: {
        emoji: nonNull("String"),
        name: nonNull("String"),
      },
      async resolve(_, { emoji, name }, ctx) {
        const account = await auth(ctx);

        const tagCount = await ctx.db.tag.count({
          where: { accountId: account.id },
        });

        if (tagCount >= 5)
          throw new UserInputError(
            "you've reached the maximum number of tags."
          );

        const tagExists = await ctx.db.tag.findFirst({
          where: {
            accountId: account.id,
            tag: { equals: name, mode: "insensitive" },
          },
        });

        if (tagExists !== null)
          throw new UserInputError("you already have a tag with that name");

        const isUnicodeEmoji = Emoji.find(emoji);

        if (!isUnicodeEmoji) {
          const isCustomEmoji = emoji.match(/(<a?)?:\w+:(\d{18}>)?/g) !== null;

          if (!isCustomEmoji)
            throw new UserInputError(
              "`emoji` must be a valid Emoji 13.1 or custom discord emoji"
            );
        }

        if (name.length > 15)
          throw new UserInputError("`name` must not exceed 10 characters");

        const tag = await ctx.db.tag.create({
          data: { accountId: account.id, tag: name, emoji },
        });

        return tag;
      },
    });
  },
});

export const queSearchTags = extendType({
  type: "Query",
  definition(t) {
    t.field("searchTags", {
      type: nonNull(list(nonNull("Tag"))),
      args: {
        search: nonNull("String"),
      },
      async resolve(_, { search }, ctx) {
        const account = await auth(ctx);

        const tags = await ctx.db.tag.findMany({
          where: {
            accountId: account.id,
            tag: { contains: search, mode: "insensitive" },
          },
        });

        return tags;
      },
    });
  },
});
