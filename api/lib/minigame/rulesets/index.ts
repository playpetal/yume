import { MinigameType } from "@prisma/client";
import { Ruleset } from "yume";
import rulesetGuessCharacter from "./guess-character";
import rulesetGuessTheSong from "./guess-the-song";

export const rulesets: { [key in MinigameType]?: Ruleset } = {
  GTS: rulesetGuessTheSong,
  GUESS_CHARACTER: rulesetGuessCharacter,
} as const;
