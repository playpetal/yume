import { extendType, list, nonNull, objectType } from "nexus";
import { Group } from "nexus-prisma";
import { checkAuth } from "../../lib/Auth";
import { userInGroup } from "../../lib/Permissions";

export const GroupObject = objectType({
  name: Group.$name,
  description: Group.$description,
  definition(t) {
    t.field(Group.id);
    t.field(Group.name);
    t.field(Group.creation);
    t.field(Group.gender);
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
        gender: "GroupGender",
      },
      async resolve(_, args, ctx) {
        const account = await checkAuth(ctx);
        await userInGroup(ctx, account.discordId, ["Release Manager"]);

        return ctx.db.group.create({
          data: {
            name: args.name,
            creation: args.creation,
            gender: args.gender,
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
        const account = await checkAuth(ctx);
        await userInGroup(ctx, account.discordId, ["Release Manager"]);

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
        gender: "GroupGender",
      },
      async resolve(_, args, ctx) {
        const account = await checkAuth(ctx);
        await userInGroup(ctx, account.discordId, ["Release Manager"]);

        return ctx.db.group.update({
          where: { id: args.id },
          data: {
            name: args.name || undefined,
            creation: args.creation,
            gender: args.gender,
          },
        });
      },
    });
  },
});

export const GetGroupQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getGroup", {
      type: "Group",
      args: {
        id: nonNull("Int"),
      },
      async resolve(_, args, ctx) {
        return ctx.db.group.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const SearchGroupsQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("searchGroups", {
      type: nonNull(list(nonNull("Group"))),
      args: {
        search: nonNull("String"),
      },
      async resolve(_, args, ctx) {
        return ctx.db.group.findMany({
          where: {
            OR: [
              { name: { contains: args.search, mode: "insensitive" } },
              {
                aliases: {
                  some: {
                    alias: { contains: args.search, mode: "insensitive" },
                  },
                },
              },
            ],
          },
          take: 25,
        });
      },
    });
  },
});
