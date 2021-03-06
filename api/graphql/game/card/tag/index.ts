import { UserInputError } from "apollo-server";
import { extendType, list, nonNull, objectType } from "nexus";
import { Tag } from "nexus-prisma";
import { auth } from "../../../../lib/Auth";
import Emoji from "node-emoji";
import { InvalidInputError } from "../../../../lib/error";

export * from "./mutation";

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

    t.field("cardCount", {
      type: nonNull("Int"),
      async resolve(root, _, ctx) {
        const count = await ctx.db.card.count({ where: { tagId: root.id } });

        return count;
      },
    });
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

        const nameIsInvalid = name.match(/[^a-z0-9]/gim);

        if (nameIsInvalid)
          throw new InvalidInputError(
            "tag names may only contain alphanumeric characters!"
          );

        if (name.length > 15 || name.length < 1)
          throw new InvalidInputError(
            "tag names may only be 1-15 characters long!"
          );

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
            throw new InvalidInputError(
              "emojis must be either Emoji 13.1 or custom Discord emoji!"
            );
        }

        const tag = await ctx.db.tag.create({
          data: { accountId: account.id, tag: name, emoji },
        });

        return tag;
      },
    });
  },
});

export const queIsEmoji = extendType({
  type: "Query",
  definition(t) {
    t.field("isEmoji", {
      type: nonNull("Boolean"),
      args: { emoji: nonNull("String") },
      resolve(_, { emoji }) {
        const isUnicode = Emoji.find(emoji);
        if (isUnicode) return true;

        const isCustomEmoji = emoji.match(/(<a?)?:\w+:(\d{18}>)?/g) !== null;
        return isCustomEmoji;
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

export const queGetTag = extendType({
  type: "Query",
  definition(t) {
    t.field("getTag", {
      type: "Tag",
      args: {
        tag: nonNull("String"),
      },
      async resolve(_, { tag }, ctx) {
        const account = await auth(ctx);

        const targetTag = await ctx.db.tag.findFirst({
          where: {
            accountId: account.id,
            tag: { equals: tag, mode: "insensitive" },
          },
        });

        return targetTag;
      },
    });
  },
});
