import { Character, MinigameType } from "@prisma/client";
import { GameSong, MinigameDataType } from "yume";

export function createMinigameData<T extends MinigameType>({
  answer,
  type,
  isGendered,
}: {
  answer: T extends "GTS"
    ? GameSong
    : T extends "WORDS"
    ? string
    : T extends "GUESS_CHARACTER"
    ? Character
    : never;
  type: T;
  isGendered: boolean;
}): MinigameDataType<T> {
  const data = {
    type,
    answer,
    isGendered,
    attempts: 0,
    correct: false,
    startedAt: new Date(),
  } as MinigameDataType<T>;

  return data;
}
