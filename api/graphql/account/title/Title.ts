import { extendType, list, nonNull, objectType } from "nexus";
import { Title, TitleInventory } from "nexus-prisma";

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
    t.field("titles", {
      type: nonNull(list(nonNull("Title"))),
      args: { id: "Int", name: "String" },
      async resolve(_, args, ctx) {
        return ctx.db.title.findMany({
          where: {
            id: args.id ?? undefined,
            title: args.name
              ? { contains: args.name, mode: "insensitive" }
              : undefined,
          },
        });
      },
    });
  },
});

export const UserTitlesQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("userTitles", {
      type: nonNull(list(nonNull("TitleInventory"))),
      args: { discordId: nonNull("String") },
      async resolve(_, args, ctx) {
        return ctx.db.titleInventory.findMany({
          where: { account: { discordId: args.discordId } },
        });
      },
    });
  },
});
