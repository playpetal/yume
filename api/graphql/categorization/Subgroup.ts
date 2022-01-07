import { extendType, list, nonNull, objectType } from "nexus";
import { Subgroup } from "nexus-prisma";
import { checkAuth } from "../../lib/Auth";
import { userInGroup } from "../../lib/Permissions";

export const SubgroupObject = objectType({
  name: Subgroup.$name,
  description: Subgroup.$description,
  definition(t) {
    t.field(Subgroup.id);
    t.field(Subgroup.name);
    t.field(Subgroup.creation);
  },
});

export const CreateSubgroupMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createSubgroup", {
      type: nonNull("Subgroup"),
      args: { name: nonNull("String"), creation: "DateTime" },
      async resolve(_, args, ctx) {
        const account = await checkAuth(ctx);
        await userInGroup(ctx, account.discordId, [
          "Developer",
          "Release Manager",
        ]);

        return ctx.db.subgroup.create({ data: args });
      },
    });
  },
});

export const DeleteSubgroupMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteSubgroup", {
      type: nonNull("Int"),
      args: { id: nonNull("Int") },
      async resolve(_, args, ctx) {
        const account = await checkAuth(ctx);
        await userInGroup(ctx, account.discordId, [
          "Developer",
          "Release Manager",
        ]);

        await ctx.db.subgroup.delete({ where: args });

        return args.id;
      },
    });
  },
});

export const UpdateSubgroupMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateSubgroup", {
      type: nonNull("Subgroup"),
      args: { id: nonNull("Int"), name: "String", creation: "DateTime" },
      async resolve(_, args, ctx) {
        const account = await checkAuth(ctx);
        await userInGroup(ctx, account.discordId, [
          "Developer",
          "Release Manager",
        ]);

        return ctx.db.subgroup.update({
          where: { id: args.id },
          data: { name: args.name ?? undefined, creation: args.creation },
        });
      },
    });
  },
});

export const SubgroupsQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("subgroups", {
      type: nonNull(list(nonNull("Subgroup"))),
      args: { id: "Int", name: "String", creation: "DateTime" },
      async resolve(_, args, ctx) {
        return ctx.db.subgroup.findMany({
          where: {
            id: args.id ?? undefined,
            name: args.name ?? undefined,
            creation: args.creation ?? undefined,
          },
        });
      },
    });
  },
});
