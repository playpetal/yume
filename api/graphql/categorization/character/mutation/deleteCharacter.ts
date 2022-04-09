import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";

export const deleteCharacter = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteCharacter", {
      type: nonNull("Int"),
      args: { id: nonNull("Int") },
      async resolve(_, args, ctx) {
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const character = await ctx.db.character.delete({
          where: { id: args.id },
        });

        return character.id;
      },
    });
  },
});
