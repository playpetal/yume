import { extendType, nonNull } from "nexus";
import { auth } from "../../../../lib/Auth";

export const UpdateCharacterMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateCharacter", {
      type: nonNull("Character"),
      args: {
        id: nonNull("Int"),
        name: "String",
        birthday: "DateTime",
        gender: "Gender",
      },
      async resolve(_, args, ctx) {
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const character = await ctx.db.character.update({
          where: { id: args.id },
          data: {
            name: args.name || undefined,
            birthday: args.birthday,
            gender: args.gender,
          },
        });

        return character;
      },
    });
  },
});
