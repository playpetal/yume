import { objectType } from "nexus";
import { Character } from "nexus-prisma";

export const CharacterObject = objectType({
  name: Character.$name,
  description: Character.$description,
  definition(t) {
    t.field(Character.id);
    t.field(Character.name);
    t.field(Character.birthday);
    t.field(Character.gender);
  },
});
