import { extendType, list, nonNull, objectType } from "nexus";
import { Alias } from "nexus-prisma";
import { auth } from "../../lib/Auth";

export const AliasObject = objectType({
  name: Alias.$name,
  description: Alias.$description,
  definition(t) {
    t.field(Alias.id);
    t.field(Alias.groupId);
    t.field("group", {
      type: nonNull("Group"),
      async resolve(alias, _, ctx) {
        const group = await ctx.db.group.findFirst({
          where: { id: alias.groupId },
        });

        return group!;
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
        await auth(ctx, { requiredGroups: ["Release Manager"] });

        const alias = await ctx.db.alias.create({ data: args });

        return alias;
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
        await auth(ctx, { requiredGroups: ["Release Manager"] });

        const alias = await ctx.db.alias.delete({ where: args });

        return alias.id;
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
        await auth(ctx, { requiredGroups: ["Release Manager"] });

        const alias = await ctx.db.alias.update({
          where: { id: args.id },
          data: {
            groupId: args.groupId || undefined,
            alias: args.alias || undefined,
          },
        });

        return alias;
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
        const aliases = await ctx.db.alias.findMany({
          where: {
            id: args.id ?? undefined,
            groupId: args.groupId ?? undefined,
            alias: args.alias ?? undefined,
          },
        });

        return aliases;
      },
    });
  },
});
