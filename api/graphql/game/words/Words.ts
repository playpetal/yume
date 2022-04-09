import { extendType, nonNull } from "nexus";
import { auth } from "../../../lib/Auth";
import { getWord, wordIsValid } from "../../../lib/game/words";

export const GetWord = extendType({
  type: "Query",
  definition(t) {
    t.field("word", {
      type: nonNull("String"),
      async resolve(_, __, ctx) {
        await auth(ctx);
        return getWord();
      },
    });
  },
});

export const WordIsValid = extendType({
  type: "Query",
  definition(t) {
    t.field("isWordValid", {
      type: nonNull("Boolean"),
      args: {
        word: nonNull("String"),
      },
      async resolve(_, { word }) {
        return wordIsValid(word);
      },
    });
  },
});
