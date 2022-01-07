import { UserInputError } from "apollo-server";
import { extendType, list, nonNull, objectType } from "nexus";
import { AccountUserGroup, UserGroup } from "nexus-prisma";
import { checkAuth } from "../../lib/Auth";
import { userInGroup } from "../../lib/Permissions";

export const UserGroupObject = objectType({
  name: UserGroup.$name,
  description: UserGroup.$description,
  definition(t) {
    t.field(UserGroup.id);
    t.field(UserGroup.name);
    t.field("members", {
      type: nonNull(list(nonNull("AccountUserGroup"))),
      resolve(root, _, ctx) {
        return ctx.db.accountUserGroup.findMany({
          where: { groupId: root.id },
        });
      },
    });
  },
});

export const AccountUserGroupObject = objectType({
  name: AccountUserGroup.$name,
  description: AccountUserGroup.$description,
  definition(t) {
    t.field(AccountUserGroup.id);
    t.field(AccountUserGroup.groupId);
    t.field(AccountUserGroup.accountId);
    t.field("group", {
      type: "UserGroup",
      resolve(root, _, ctx) {
        return ctx.db.userGroup.findFirst({ where: { id: root.groupId } });
      },
    });
    t.field("account", {
      type: "Account",
      resolve(root, _, ctx) {
        return ctx.db.account.findFirst({ where: { id: root.accountId } });
      },
    });
  },
});

export const CreateUserGroupMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createUserGroup", {
      type: nonNull("UserGroup"),
      args: {
        name: nonNull("String"),
      },
      async resolve(_, args, ctx) {
        const account = await checkAuth(ctx);
        await userInGroup(ctx, account.discordId, ["Developer"]);

        const groupExists = await ctx.db.userGroup.findFirst({
          where: { name: args.name },
        });

        if (groupExists)
          throw new UserInputError("That user group already exists.");

        return ctx.db.userGroup.create({ data: { name: args.name } });
      },
    });
  },
});

export const AssignGroupMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("assignGroup", {
      type: nonNull("AccountUserGroup"),
      args: {
        accountId: nonNull("Int"),
        groupId: nonNull("Int"),
      },
      async resolve(_, args, ctx) {
        const account = await checkAuth(ctx);
        await userInGroup(ctx, account.discordId, ["Developer"]);

        const targetAccount = await ctx.db.account.findFirst({
          where: { id: args.accountId },
        });
        if (!targetAccount)
          throw new UserInputError("There is no user by that ID.");

        const targetGroup = await ctx.db.userGroup.findFirst({
          where: { id: args.groupId },
        });
        if (!targetGroup)
          throw new UserInputError("There is no user group by that ID.");

        const assignmentExists = await ctx.db.accountUserGroup.findFirst({
          where: { accountId: targetAccount.id, groupId: targetGroup.id },
        });

        if (assignmentExists)
          throw new UserInputError(
            "That user is already assigned to that group."
          );

        return ctx.db.accountUserGroup.create({
          data: { accountId: targetAccount.id, groupId: targetGroup.id },
        });
      },
    });
  },
});

export const UnassignGroupMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("unassignGroup", {
      type: nonNull("Int"),
      args: {
        accountId: nonNull("Int"),
        groupId: nonNull("Int"),
      },
      async resolve(_, args, ctx) {
        const account = await checkAuth(ctx);
        await userInGroup(ctx, account.discordId, ["Developer"]);

        const targetAccount = await ctx.db.account.findFirst({
          where: { id: args.accountId },
        });
        if (!targetAccount)
          throw new UserInputError("There is no user by that ID.");

        const targetGroup = await ctx.db.userGroup.findFirst({
          where: { id: args.groupId },
        });
        if (!targetGroup)
          throw new UserInputError("There is no user group by that ID.");

        const assignment = await ctx.db.accountUserGroup.findFirst({
          where: { accountId: targetAccount.id, groupId: targetGroup.id },
        });

        if (!assignment)
          throw new UserInputError("That user is not assigned to that group.");

        await ctx.db.accountUserGroup.delete({
          where: { id: assignment.id },
        });

        return assignment.id;
      },
    });
  },
});
