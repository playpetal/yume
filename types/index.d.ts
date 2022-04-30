declare module "yume" {
  export type Flag = keyof typeof import("../api/lib/flags").FLAGS;

  export type Ruleset = {
    timeLimit: number;
    maxAttempts: number;
  };

  export type MinigameState =
    | "PLAYING"
    | "CANCELLED"
    | "FAILED"
    | "PENDING"
    | "COMPLETED";

  export type MinigameSong = {
    title: string;
    group?: string;
    soloist?: string;
  };

  export type Minigame<T extends import("@prisma/client").MinigameType> = {
    type: T;
    accountId: number;
    messageId?: string;
    channelId?: string;
    guildId?: string;
    state: MinigameState;
    maxAttempts: number;
    timeLimit: number;
    startedAt: number;
    elapsed?: number;
  } & (T extends "GUESS_THE_SONG"
    ? GuessTheSongMinigame
    : T extends "GUESS_THE_IDOL"
    ? GuessTheIdolMinigame
    : T extends "GUESS_THE_GROUP"
    ? GuessTheGroupMinigame
    : { attempts: any[] });

  export type MinigameComparison = "GREATER" | "LESS" | "EQUAL";

  export type GuessTheSongMinigame = {
    video?: string;
    song: MinigameSong;
    attempts: MinigameSong[];
  };

  export type GuessTheIdolCharacter = {
    name: string;
    birthday?: Date | null;
    gender?: import("@prisma/client").Gender | null;
    nameLength: MinigameComparison;
    birthDate: MinigameComparison;
    isGender: boolean;
  };

  export type GuessTheIdolMinigame = {
    character: import("@prisma/client").Character;
    group?: string;
    attempts: GuessTheIdolCharacter[];
  };

  export type GuessTheGroupMinigame = {
    group: import("@prisma/client").Group;
    attempts: import("@prisma/client").Group[];
  };

  type Reward = "PETAL" | "LILY" | "CARD";
}
