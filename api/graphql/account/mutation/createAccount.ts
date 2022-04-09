import { extendType, nonNull } from "nexus";
import jwt from "jsonwebtoken";
import {
  UnauthorizedError,
  InvalidInputError,
  DuplicateAccountError,
  UsernameTakenError,
} from "../../../lib/error";

export const CreateAccountMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createAccount", {
      type: nonNull("Account"),
      args: {
        username: nonNull("String"),
      },
      async resolve(_, args, ctx) {
        const auth = ctx.req.headers.authorization;
        if (!auth) throw new UnauthorizedError();

        let discordId: string | undefined;

        const usernameIsInvalid = RegExp(/[^A-Za-z0-9 _-]+/gm).exec(
          args.username
        );
        if (usernameIsInvalid)
          throw new InvalidInputError(
            "usernames may only contain alphanumeric characters, spaces, hyphens, and underscores."
          );

        if (args.username.length > 20 || args.username.length < 2)
          throw new InvalidInputError(
            "username can only be 2-20 characters long."
          );

        try {
          const { id } = jwt.verify(auth, process.env.SHARED_SECRET!) as {
            id: string;
          };

          discordId = id;
        } catch (e) {
          throw new UnauthorizedError();
        }

        const accountExists = await ctx.db.account.findFirst({
          where: { discordId },
        });

        if (accountExists) throw new DuplicateAccountError();

        const usernameExists = await ctx.db.account.findFirst({
          where: { username: { equals: args.username, mode: "insensitive" } },
        });

        if (usernameExists) throw new UsernameTakenError();

        return await ctx.db.account.create({
          data: { discordId, username: args.username },
        });
      },
    });
  },
});
