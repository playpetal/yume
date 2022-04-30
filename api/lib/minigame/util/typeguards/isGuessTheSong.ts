import { MinigameType } from "@prisma/client";
import { Minigame } from "yume";

export function isGuessTheSong(
  minigame: Minigame<MinigameType>
): minigame is Minigame<"GUESS_THE_SONG"> {
  return minigame.type === "GUESS_THE_SONG";
}
