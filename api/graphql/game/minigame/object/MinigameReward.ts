import { nonNull, objectType } from "nexus";

export const MinigameReward = objectType({
  name: "MinigameReward",
  description: "Contains data pertaining to rewards claimed for a minigame.",
  definition(t) {
    t.field("card", {
      type: "Card",
      description: "If applicable, returns the card claimed from the minigame.",
    });

    t.field("account", {
      type: nonNull("Account"),
      description: "Returns the account of the minigame player.",
    });
  },
});
