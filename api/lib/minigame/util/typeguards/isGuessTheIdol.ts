import { MinigameType } from "@prisma/client";
import { Minigame } from "yume";

export function isGuessTheIdol(
  minigame: Minigame<MinigameType>
): minigame is Minigame<"GUESS_THE_IDOL"> {
  return minigame.type === "GUESS_THE_IDOL";
}
