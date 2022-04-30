import { MinigameType } from "@prisma/client";
import { Minigame } from "yume";

export function isGuessTheSong(
  minigame: Minigame<MinigameType>
): minigame is Minigame<"GTS"> {
  return minigame.type === "GTS";
}
