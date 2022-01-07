import { extendType, list, nonNull, objectType } from "nexus";
import { Alias } from "nexus-prisma";
import { checkAuth } from "../../lib/Auth";
import { userInGroup } from "../../lib/Permissions";

export const AliasObject = objectType({
  name: Alias.$name,
  description: Alias.$description,
  definition(t) {
    t.field(Alias.id);
    t.field(Alias.groupId);
    t.field("group", {
      type: nonNull("Group"),
      async resolve(alias, _, ctx) {
        return (await ctx.db.group.findFirst({
          where: { id: alias.groupId },
        }))!;
      },
    });
    t.field(Alias.alias);
  },
});

export const CreateAliasMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createAlias", {
      type: nonNull("Alias"),
      args: {
        groupId: nonNull("Int"),
        alias: nonNull("String"),
      },
      async resolve(_, args, ctx) {
        const account = await checkAuth(ctx);
        await userInGroup(ctx, account.discordId, [
          "Developer",
          "Release Manager",
        ]);

        return ctx.db.alias.create({ data: args });
      },
    });
  },
});

export const DeleteAliasMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteAlias", {
      type: nonNull("Int"),
      args: { id: nonNull("Int") },
      async resolve(_, args, ctx) {
        const account = await checkAuth(ctx);
        await userInGroup(ctx, account.discordId, [
          "Developer",
          "Release Manager",
        ]);

        await ctx.db.alias.delete({ where: args });

        return args.id;
      },
    });
  },
});

export const UpdateAliasMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateAlias", {
      type: nonNull("Alias"),
      args: { id: nonNull("Int"), groupId: "Int", alias: "String" },
      async resolve(_, args, ctx) {
        const account = await checkAuth(ctx);
        await userInGroup(ctx, account.discordId, [
          "Developer",
          "Release Manager",
        ]);

        return ctx.db.alias.update({
          where: { id: args.id },
          data: {
            groupId: args.groupId || undefined,
            alias: args.alias || undefined,
          },
        });
      },
    });
  },
});

export const AliasesQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("aliases", {
      type: nonNull(list(nonNull("Alias"))),
      args: { id: "Int", groupId: "Int", alias: "String" },
      async resolve(_, args, ctx) {
        return ctx.db.alias.findMany({
          where: {
            id: args.id ?? undefined,
            groupId: args.groupId ?? undefined,
            alias: args.alias ?? undefined,
          },
        });
      },
    });
  },
});
