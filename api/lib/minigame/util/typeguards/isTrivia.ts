import { MinigameType } from "@prisma/client";
import { Minigame } from "yume";

export function isTrivia(
  minigame: Minigame<MinigameType>
): minigame is Minigame<"TRIVIA"> {
  return minigame.type === "TRIVIA";
}
