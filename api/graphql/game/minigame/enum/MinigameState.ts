import { enumType } from "nexus";

export const MinigameState = enumType({
  name: "MinigameState",
  description: "Represents the state of a minigame.",
  members: [
    {
      name: "PLAYING",
      description: "Set when the minigame is still being played.",
    },
    {
      name: "CANCELLED",
      description: "Set when the minigame has been cancelled by the player.",
    },
    {
      name: "FAILED",
      description:
        "Set when the minigame has finished by time expiration or by reaching the attempt limit.",
    },
    {
      name: "PENDING",
      description:
        "Set when the minigame has been completed and the reward is pending.",
    },
    {
      name: "COMPLETED",
      description:
        "Set when the minigame has been completed and the reward has been claimed.",
    },
  ],
});
