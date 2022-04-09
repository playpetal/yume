import { extendType, nonNull } from "nexus";

export const getCharacter = extendType({
  type: "Query",
  definition(t) {
    t.field("getCharacter", {
      type: "Character",
      args: {
        id: nonNull("Int"),
      },
      async resolve(_, args, ctx) {
        return ctx.db.character.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});
