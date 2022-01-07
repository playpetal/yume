import { AuthenticationError, UserInputError } from "apollo-server";
import { extendType, list, nonNull, objectType } from "nexus";
import { AccountUserGroup, UserGroup } from "nexus-prisma";
import { userInGroup } from "../../lib/Permissions";
import { discordOAuth2 } from "../util/auth/DiscordOAuth";

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
        const auth = ctx.req.headers.authorization;
        if (!auth)
          throw new AuthenticationError(
            "Authorization is required to use this mutation."
          );

        const user = await discordOAuth2.getUser(auth);
        if (!user)
          throw new AuthenticationError(
            "Authorization is required to use this mutation."
          );

        const canUseQuery = await userInGroup(ctx, user.id, ["Developer"]);

        if (!canUseQuery)
          throw new AuthenticationError(
            "You don't have permission to use this mutation."
          );

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
