import { enumType } from "nexus";

export const MinigameComparison = enumType({
  name: "MinigameComparison",
  description: "Compares attempt information to the answer.",
  members: ["GREATER", "LESS", "EQUAL"],
});
