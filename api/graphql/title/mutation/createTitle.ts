import { UserInputError } from "apollo-server";
import { extendType, nonNull } from "nexus";
import { auth } from "../../../lib/Auth";

export const CreateTitle = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createTitle", {
      type: nonNull("Title"),
      args: { title: nonNull("String"), description: "String" },
      async resolve(_, { title, description }, ctx) {
        await auth(ctx, { requiredFlags: ["DEVELOPER"] });

        const titleExists = await ctx.db.title.findFirst({ where: { title } });
        if (titleExists) throw new UserInputError("that title already exists.");

        return await ctx.db.title.create({ data: { title, description } });
      },
    });
  },
});
