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
      args: { id: nonNull("Int") },
      async resolve(_, args, ctx) {
        return ctx.db.title.findFirst({
          where: {
            id: args.id,
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
      args: {id: nonNull("Int")},
      async resolve(_,args,ctx) {
        return ctx.db.titleInventory.findUnique({where: {id:args.id}});
      }
    })
  }
})

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
