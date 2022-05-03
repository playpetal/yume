import { extendType, nonNull } from "nexus";

export const GetUserQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("user", {
      type: "Account",
      args: { account: nonNull("AccountInput") },
      async resolve(_, { account }, ctx) {
        const _account = await ctx.db.account.findFirst({
          where: {
            username: account.username
              ? { equals: account.username, mode: "insensitive" }
              : undefined,
            id: account.id ?? undefined,
            discordId: account.discordId ?? undefined,
          },
        });

        return _account;
      },
    });
  },
});
