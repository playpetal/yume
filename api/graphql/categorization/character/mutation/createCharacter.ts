import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";

export const createCharacter = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createCharacter", {
      type: nonNull("Character"),
      args: { name: nonNull("String"), birthday: "DateTime", gender: "Gender" },
      async resolve(_, args, ctx) {
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const character = await ctx.db.character.create({
          data: {
            name: args.name,
            birthday: args.birthday,
            gender: args.gender,
          },
        });

        return character;
      },
    });
  },
});
