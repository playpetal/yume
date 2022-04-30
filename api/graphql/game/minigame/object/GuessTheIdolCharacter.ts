import { nonNull, objectType } from "nexus";

export const GuessTheIdolCharacter = objectType({
  name: "GuessTheIdolCharacter",
  description: "Contains data for 'Guess The Idol' attempts.",
  definition(t) {
    t.field("name", { type: nonNull("String") });
    t.field("birthday", { type: "DateTime" });
    t.field("gender", { type: "Gender" });

    t.field("nameLength", { type: nonNull("MinigameComparison") });
    t.field("birthDate", { type: nonNull("MinigameComparison") });
    t.field("isGender", { type: nonNull("Boolean") });
  },
});
