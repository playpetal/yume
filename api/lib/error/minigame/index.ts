import { ApolloError } from "apollo-server";

export class MinigameNotImplementedError extends ApolloError {
  isUserFacing = true;
  name = "MinigameNotImplementedError";

  constructor() {
    super(
      "this minigame has not yet been implemented!",
      "MINIGAME_NOT_IMPLEMENTED"
    );
  }
}

export class AllRewardsClaimedError extends ApolloError {
  isUserFacing = true;
  name = "AllRewardsClaimedError";

  constructor() {
    super(
      "you've already claimed all your rewards this hour!",
      "ALL_REWARDS_CLAIMED"
    );
  }
}

export class AllPremiumRewardsClaimedError extends ApolloError {
  isUserFacing = true;
  name = "AllPremiumRewardsClaimedError";

  constructor() {
    super(
      "there are no more lilies available today!",
      "ALL_PREMIUM_REWARDS_CLAIMED"
    );
  }
}

export class RewardsAlreadyClaimedError extends ApolloError {
  isUserFacing = true;
  name = "RewardsAlreadyClaimedError";

  constructor(message: string) {
    super(message, "REWARDS_ALREADY_CLAIMED");
  }
}

export class RewardsPendingError extends ApolloError {
  isUserFacing = true;
  name = "RewardsPendingError";

  constructor(message: string) {
    super(message, "REWARDS_PENDING");
  }
}

export class NoRewardsPendingError extends ApolloError {
  isUserFacing = true;
  name = "NoRewardsPendingError";

  constructor() {
    super(
      "you have no rewards pending for this minigame!",
      "NO_REWARDS_PENDING"
    );
  }
}

export class NotPlayingMinigameError extends ApolloError {
  isUserFacing = true;
  name = "NotPlayingMinigameError";

  constructor(minigame: string) {
    super(`you're not currently playing ${minigame}!`, "NOT_PLAYING_MINIGAME");
  }
}

export class PlayingOtherMinigameError extends ApolloError {
  isUserFacing = true;
  name = "PlayingOtherMinigameError";

  constructor() {
    super(
      "you're currently playing a different minigame!",
      "PLAYING_OTHER_MINIGAME"
    );
  }
}
