import { list, nonNull, objectType } from "nexus";

export const GuessTheSong = objectType({
  name: "GuessTheSong",
  description: "Contains data for the 'Guess The Song' minigame.",
  definition(t) {
    t.field("accountId", {
      type: nonNull("Int"),
      description: "The ID of the account that initiated the minigame.",
    });
    t.field("account", {
      type: nonNull("Account"),
      description: "The account that initiated the minigame.",
      async resolve({ accountId }, _, ctx) {
        const account = await ctx.db.account.findFirst({
          where: { id: accountId },
        });

        return account!;
      },
    });

    t.field("type", {
      type: nonNull("MinigameType"),
      description: "The type of the minigame.",
    });

    t.field("messageId", {
      type: "String",
      description:
        "The ID of the Discord message that this minigame is being played at, if applicable.",
    });

    t.field("channelId", {
      type: "String",
      description:
        "The ID of the Discord channel that this minigame is being played at, if applicable.",
    });

    t.field("guildId", {
      type: "String",
      description:
        "The ID of the Discord guild that this minigame is being played at, if applicable.",
    });

    t.field("video", {
      type: "String",
      description:
        "A Base64-encoded video of the song to guess. Will only be returned on minigame start.",
    });

    t.field("state", {
      type: nonNull("MinigameState"),
      description: "The state of the minigame.",
    });

    t.field("song", {
      type: "MinigameSong",
      description:
        "The solution to the minigame. Will only be returned when the minigame state is CANCELLED, FAILED, PENDING, or COMPLETED.",
    });

    t.field("attempts", {
      type: nonNull(list(nonNull("MinigameSong"))),
      description:
        "A list of songs that have already been guessed in this minigame.",
    });

    t.field("maxAttempts", {
      type: nonNull("Int"),
      description:
        "The maximium amount of attempts that can be made in this minigame.",
    });

    t.field("timeLimit", {
      type: nonNull("Int"),
      description: "The amount of time allotted for this minigame.",
    });

    t.field("startedAt", {
      type: nonNull("DateTime"),
      description: "The time at which this minigame began.",
    });

    t.field("elapsed", {
      type: "Int",
      description:
        "The time, in milliseconds, this minigame took to complete. Will only returned when the minigame has ended.",
    });
  },
});
