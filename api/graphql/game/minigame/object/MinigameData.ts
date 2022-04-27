import { nonNull, objectType } from "nexus";

export const MinigameData = objectType({
  name: "MinigameData",
  description: "MinigameData",
  definition(t) {
    t.field("type", { type: nonNull("MinigameType") });
    t.field("isGendered", { type: "Boolean" });

    t.field("attempts", { type: nonNull("Int") });

    t.field("correct", { type: "Boolean" });
    t.field("elapsed", { type: "Int" });
    t.field("startedAt", { type: nonNull("DateTime") });
  },
});
