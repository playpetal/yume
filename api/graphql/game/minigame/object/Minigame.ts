import { nonNull, objectType } from "nexus";

export const Minigame = objectType({
  name: "Minigame",
  description: "Minigame",
  definition(t) {
    t.field("accountId", { type: nonNull("Int") });
    t.field("type", { type: nonNull("MinigameType") });
    t.field("data", { type: nonNull("MinigameData") });

    t.field("messageId", { type: "String" });
    t.field("channelId", { type: "String" });
    t.field("guildId", { type: "String" });
  },
});
