import { extendType, list, nonNull, objectType } from "nexus";
import { Subgroup } from "nexus-prisma";
import { auth } from "../../lib/Auth";

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
        await auth(ctx, { requiredGroups: ["Release Manager"] });

        const subgroup = await ctx.db.subgroup.create({ data: args });

        return subgroup;
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
        await auth(ctx, { requiredGroups: ["Release Manager"] });

        const subgroup = await ctx.db.subgroup.delete({ where: args });

        return subgroup.id;
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
        await auth(ctx, { requiredGroups: ["Release Manager"] });

        const subgroup = await ctx.db.subgroup.update({
          where: { id: args.id },
          data: { name: args.name ?? undefined, creation: args.creation },
        });

        return subgroup;
      },
    });
  },
});

export const GetSubgroupQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getSubgroup", {
      type: "Subgroup",
      args: { id: nonNull("Int") },
      async resolve(_, args, ctx) {
        return ctx.db.subgroup.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const SearchSubgroupsQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("searchSubgroups", {
      type: nonNull(list(nonNull("Subgroup"))),
      args: {
        search: nonNull("String"),
      },
      async resolve(_, args, ctx) {
        return ctx.db.subgroup.findMany({
          where: { name: { contains: args.search, mode: "insensitive" } },
          take: 25,
        });
      },
    });
  },
});
