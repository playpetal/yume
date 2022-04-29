declare module "yume" {
  export type Flag = keyof typeof import("../api/lib/flags").FLAGS;

  export type AnswerType = "CHARACTER" | "SONG";
  export type Ruleset = {
    timeLimit: number;
    maxAttempts: number;
    answerType: AnswerType;
  };

  export type MinigameType = "GTS";
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

  export type GuessTheSongMinigame<T extends boolean> = {
    type: "GTS";
    accountId: number;

    messageId?: string;
    channelId?: string;
    guildId?: string;

    video?: string;
    state: MinigameState;
    song: T extends true ? MinigameSong : MinigameSong | null;
    attempts: MinigameSong[];
    maxAttempts: number;
    timeLimit: number;
    startedAt: Date;
    elapsed?: number;
  };

  type Reward = "PETAL" | "LILY" | "CARD";
}
