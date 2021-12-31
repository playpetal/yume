import { extendType, list, nonNull, objectType } from "nexus";
import { Group } from "nexus-prisma";

export const GroupObject = objectType({
  name: Group.$name,
  description: Group.$description,
  definition(t) {
    t.field(Group.id);
    t.field(Group.name);
    t.field(Group.creation);
    t.field("aliases", {
      type: nonNull(list(nonNull("Alias"))),
      async resolve(group, __, ctx) {
        return ctx.db.alias.findMany({ where: { groupId: group.id } });
      },
    });
  },
});

export const CreateGroupMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createGroup", {
      type: nonNull("Group"),
      args: {
        name: nonNull("String"),
        creation: "DateTime",
      },
      async resolve(_, args, ctx) {
        return ctx.db.group.create({
          data: {
            name: args.name,
            creation: args.creation,
          },
        });
      },
    });
  },
});

export const DeleteGroupMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteGroup", {
      type: nonNull("Int"),
      args: { id: nonNull("Int") },
      async resolve(_, args, ctx) {
        await ctx.db.group.delete({ where: { id: args.id } });

        return args.id;
      },
    });
  },
});

export const UpdateGroupMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateGroup", {
      type: nonNull("Group"),
      args: {
        id: nonNull("Int"),
        name: "String",
        creation: "DateTime",
      },
      async resolve(_, args, ctx) {
        return ctx.db.group.update({
          where: { id: args.id },
          data: {
            name: args.name || undefined,
            creation: args.creation,
          },
        });
      },
    });
  },
});
