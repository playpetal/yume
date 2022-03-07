import { UserInputError } from "apollo-server";
import { extendType, list, nonNull, objectType } from "nexus";
import { Title, TitleInventory } from "nexus-prisma";
import { checkAuth } from "../../../lib/Auth";
import { userInGroup } from "../../../lib/Permissions";

export const TitleObject = objectType({
  name: Title.$name,
  description: Title.$description,
  definition(t) {
    t.field(Title.id);
    t.field(Title.title);
    t.field(Title.description);
    t.field("inventory", {
      type: nonNull(list(nonNull("TitleInventory"))),
      resolve(root, _, ctx) {
        return ctx.db.titleInventory.findMany({ where: { titleId: root.id } });
      },
    });
    t.field("ownedCount", {
      type: nonNull("Int"),
      resolve(root, _, ctx) {
        return ctx.db.titleInventory.count({ where: { titleId: root.id } });
      },
    });
  },
});

export const TitleInventoryObject = objectType({
  name: TitleInventory.$name,
  description: TitleInventory.$description,
  definition(t) {
    t.field(TitleInventory.id);
    t.field("title", {
      type: nonNull("Title"),
      async resolve(root, _, ctx) {
        return (await ctx.db.title.findFirst({ where: { id: root.titleId } }))!;
      },
    });
    t.field(TitleInventory.titleId);
    t.field("account", {
      type: nonNull("Account"),
      async resolve(root, _, ctx) {
        return (await ctx.db.account.findFirst({
          where: { id: root.accountId },
        }))!;
      },
    });
    t.field(TitleInventory.accountId);
  },
});

export const TitlesQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("title", {
      type: "Title",
      args: { id: "Int", title: "String" },
      async resolve(_, { id, title }, ctx) {
        return ctx.db.title.findFirst({
          where: {
            id: id ?? undefined,
            title: title ?? undefined,
          },
        });
      },
    });
  },
});

export const GetUserTitle = extendType({
  type: "Query",
  definition(t) {
    t.field("getUserTitle", {
      type: "TitleInventory",
      args: { id: nonNull("Int") },
      async resolve(_, args, ctx) {
        return ctx.db.titleInventory.findUnique({ where: { id: args.id } });
      },
    });
  },
});

export const UserTitlesQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("userTitles", {
      type: nonNull(list(nonNull("TitleInventory"))),
      args: { accountId: nonNull("Int"), search: "String" },
      async resolve(_, args, ctx) {
        return ctx.db.titleInventory.findMany({
          where: {
            accountId: args.accountId,
            title: { title: { contains: args.search ?? undefined } },
          },
        });
      },
    });
  },
});

export const SearchTitlesQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("searchTitles", {
      type: nonNull(list(nonNull("Title"))),
      args: { search: nonNull("String") },
      async resolve(_, args, ctx) {
        return ctx.db.title.findMany({
          where: { title: { contains: args.search, mode: "insensitive" } },
        });
      },
    });
  },
});

export const CreateTitle = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createTitle", {
      type: nonNull("Title"),
      args: { title: nonNull("String"), description: "String" },
      async resolve(_, { title, description }, ctx) {
        const account = await checkAuth(ctx);
        await userInGroup(ctx, account.discordId, ["Developer"]);

        const titleExists = await ctx.db.title.findFirst({ where: { title } });
        if (titleExists) throw new UserInputError("that title already exists.");

        return await ctx.db.title.create({ data: { title, description } });
      },
    });
  },
});

export const GrantTitle = extendType({
  type: "Mutation",
  definition(t) {
    t.field("grantTitle", {
      type: nonNull("TitleInventory"),
      args: { accountId: nonNull("Int"), titleId: nonNull("Int") },
      async resolve(_, { accountId, titleId }, ctx) {
        const account = await checkAuth(ctx);
        await userInGroup(ctx, account.discordId, ["Developer"]);

        return await ctx.db.titleInventory.create({
          data: { accountId: accountId, titleId },
        });
      },
    });
  },
});

export const GrantAllTitle = extendType({
  type: "Mutation",
  definition(t) {
    t.field("grantAllTitle", {
      type: nonNull("Int"),
      args: { titleId: nonNull("Int") },
      async resolve(_, { titleId }, ctx) {
        const account = await checkAuth(ctx);
        await userInGroup(ctx, account.discordId, ["Developer"]);

        const ids = await ctx.db.account.findMany({
          where: { titles: { none: { titleId } } },
          select: { id: true },
        });

        const data = ids.map(({ id }) => {
          return { accountId: id, titleId };
        });

        const { count } = await ctx.db.titleInventory.createMany({ data });

        return count;
      },
    });
  },
});

export const RevokeTitle = extendType({
  type: "Mutation",
  definition(t) {
    t.field("revokeTitle", {
      type: nonNull("Int"),
      args: { accountId: nonNull("Int"), titleId: nonNull("Int") },
      async resolve(_, { accountId, titleId }, ctx) {
        const account = await checkAuth(ctx);
        await userInGroup(ctx, account.discordId, ["Developer"]);

        const title = await ctx.db.titleInventory.findFirst({
          where: { accountId, titleId },
        });

        if (!title)
          throw new UserInputError("that user doesn't have that title.");

        await ctx.db.titleInventory.delete({
          where: { id: title.id },
        });

        return title.id;
      },
    });
  },
});

export const RevokeAllTitle = extendType({
  type: "Mutation",
  definition(t) {
    t.field("revokeAllTitle", {
      type: nonNull("Int"),
      args: { titleId: nonNull("Int") },
      async resolve(_, { titleId }, ctx) {
        const account = await checkAuth(ctx);
        await userInGroup(ctx, account.discordId, ["Developer"]);

        const data = await ctx.db.titleInventory.findMany({
          where: { titleId },
          select: { id: true },
        });

        const ids = data.map(({ id }) => id);

        const { count } = await ctx.db.titleInventory.deleteMany({
          where: { id: { in: ids } },
        });

        return count;
      },
    });
  },
});
