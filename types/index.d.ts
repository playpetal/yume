declare module "yume" {
  export type Flag = keyof typeof import("../api/lib/flags").FLAGS;

  export type AnswerType = "CHARACTER" | "SONG";
  export type Ruleset = {
    timeLimit: number;
    maxAttempts: number;
    answerType: AnswerType;
  };

  export type MinigameDataType<
    T extends import("@prisma/client").MinigameType
  > = T extends "GTS"
    ? GTSData
    : T extends "GUESS_CHARACTER"
    ? CharacterGuessData
    : T extends "WORDS"
    ? WordsData
    : never;

  export type Minigame<T extends import("@prisma/client").MinigameType> = {
    accountId: number;
    messageId?: string;
    channelId?: string;
    guildId?: string;
    data: T extends "GTS"
      ? GTSData
      : T extends "GUESS_CHARACTER"
      ? CharacterGuessData
      : T extends "WORDS"
      ? WordsData
      : never;
  };

  export type UnknownMinigameData = CharacterGuessData | GTSData | WordsData;

  export type BaseMinigameData = {
    correct: boolean;
    attempts: number;
    isGendered: boolean;
    elapsed?: number;
    startedAt: Date;
  };

  export type CharacterGuessData = BaseMinigameData & {
    type: "GUESS_CHARACTER";
    answer: import("@prisma/client").Character;
  };

  export type GTSData = BaseMinigameData & {
    type: "GTS";
    answer: GameSong;
  };

  export type WordsData = BaseMinigameData & {
    type: "WORDS";
    answer: string;
  };

  export type GameSong = {
    id: number;
    title: string;
    group?: string;
    soloist?: string;
    video?: string;
  };

  type Reward = "PETAL" | "LILY" | "CARD";
}
