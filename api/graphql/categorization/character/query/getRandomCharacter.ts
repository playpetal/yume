import { extendType, nonNull } from "nexus";
import { getRandomCharacter } from "../../../../lib/getRandomCharacter";

export const _getRandomCharacter = extendType({
  type: "Query",
  definition(t) {
    t.field("getRandomCharacter", {
      type: nonNull("Character"),
      args: {
        gender: "Gender",
      },
      async resolve(_, { gender }, ctx) {
        const character = await getRandomCharacter(ctx, gender ?? undefined);

        return character;
      },
    });
  },
});
