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
    startedAt: Date;
    elapsed?: number;
  } & (T extends "GTS" ? GuessTheSongMinigame : GuessTheCharacterMinigame);

  export type GuessTheSongMinigame = {
    video?: string;
    song: MinigameSong;
    attempts: MinigameSong[];
  };

  export type GuessTheCharacterMinigame = {
    character: import("@prisma/client").Character | null;
    attempts: import("@prisma/client").Character[];
  };

  type Reward = "PETAL" | "LILY" | "CARD";
}
