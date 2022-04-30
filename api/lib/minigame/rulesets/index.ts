import { MinigameType } from "@prisma/client";
import { Ruleset } from "yume";
import rulesetGuessTheIdol from "./guess-the-idol";
import rulesetGuessTheSong from "./guess-the-song";

export const rulesets: { [key in MinigameType]?: Ruleset } = {
  GUESS_THE_SONG: rulesetGuessTheSong,
  GUESS_THE_IDOL: rulesetGuessTheIdol,
} as const;
