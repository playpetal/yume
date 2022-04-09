import { extendType } from "nexus";

export const GetUserQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("user", {
      type: "Account",
      args: { username: "String", id: "Int", discordId: "String" },
      async resolve(_, args, ctx) {
        return ctx.db.account.findFirst({
          where: {
            username: args.username
              ? { equals: args.username, mode: "insensitive" }
              : undefined,
            id: args.id ?? undefined,
            discordId: args.discordId ?? undefined,
          },
        });
      },
    });
  },
});
