import { ApolloError } from "apollo-server";

export class RewardsPendingError extends ApolloError {
  isUserFacing = true;
  name = "RewardsPendingError";

  constructor(message: string) {
    super(message, "REWARDS_PENDING");
  }
}

export class NotPlayingGTSError extends ApolloError {
  isUserFacing = true;
  name = "NotPlayingGTSError";

  constructor(message: string) {
    super(message, "NOT_PLAYING_GTS");
  }
}
