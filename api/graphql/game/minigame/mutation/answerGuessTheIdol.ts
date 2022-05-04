import { Character, MinigameType } from "@prisma/client";
import { extendType, nonNull } from "nexus";
import { Minigame, MinigameComparison } from "yume";
import { auth } from "../../../../lib/Auth";
import { UserFacingError } from "../../../../lib/error";
import {
  MinigameNotImplementedError,
  NotPlayingMinigameError,
  PlayingOtherMinigameError,
  RewardsPendingError,
} from "../../../../lib/error/minigame";
import { canClaimRewards } from "../../../../lib/game";
import { getMinigame } from "../../../../lib/minigame/redis/getMinigame";
import { setMinigame } from "../../../../lib/minigame/redis/setMinigame";
import { rulesets } from "../../../../lib/minigame/rulesets";
import { upsertMinigameStats } from "../../../../lib/minigame/upsertMinigameStats";
import { isGuessTheIdol } from "../../../../lib/minigame/util/typeguards/isGuessTheIdol";
import { searchCharacters } from "../../../../lib/search/searchCharacters";

export const answerGuessTheIdol = extendType({
  type: "Mutation",
  definition(t) {
    t.field("answerGuessTheIdol", {
      type: nonNull("GuessTheIdol"),
      description: "Submits an answer to a 'Guess The Song' minigame.",
      args: { answer: nonNull("String") },
      async resolve(_, { answer }, ctx) {
        const account = await auth(ctx);

        const minigame: Minigame<MinigameType> | null = await getMinigame(
          account.id
        );

        if (!minigame || minigame.state !== "PLAYING") {
          if (
            !minigame ||
            minigame.state === "FAILED" ||
            minigame.state === "CANCELLED" ||
            minigame.state === "COMPLETED"
          )
            throw new NotPlayingMinigameError("guess-the-idol");

          if (minigame.state === "PENDING")
            throw new RewardsPendingError(
              "you have rewards pending! claim them to start a new minigame."
            );
        }

        if (!isGuessTheIdol(minigame)) throw new PlayingOtherMinigameError();

        const ruleset = rulesets.GUESS_THE_IDOL;
        if (!ruleset) throw new MinigameNotImplementedError();

        const name = answer.replace(/\(\d{4}(-\d{2}){2}\)/gi, "").trim();
        const birthday = answer.match(/\d{4}(-\d{2}){2}/gi)?.[0];

        const matches = await searchCharacters(ctx, {
          search: name,
          birthday: birthday ? new Date(birthday) : undefined,
        });

        if (matches.length === 0)
          throw new UserFacingError(
            "no characters were found using your input."
          );
        if (matches.length > 1)
          throw new UserFacingError(
            "too many characters were found using your input.\nplease select a character from the dropdown!"
          );

        const [match] = matches;

        let nameLength: MinigameComparison;

        if (match.name.length < minigame.character.name.length) {
          nameLength = "GREATER";
        } else if (match.name.length > minigame.character.name.length) {
          nameLength = "LESS";
        } else {
          nameLength = "EQUAL";
        }

        let birthDate: MinigameComparison;
        const targetBirthday = new Date(
          // json sucks
          minigame.character.birthday as unknown as string
        );

        if (!match.birthday && !targetBirthday) {
          birthDate = "EQUAL";
        } else if (!match.birthday || !targetBirthday) {
          birthDate = "EQUAL";
        } else if (match.birthday.getTime() < targetBirthday.getTime()) {
          birthDate = "GREATER";
        } else if (match.birthday.getTime() > targetBirthday.getTime()) {
          birthDate = "LESS";
        } else birthDate = "EQUAL";

        let isGender: boolean = false;

        if (match.gender === minigame.character.gender) isGender = true;

        minigame.attempts.push({ ...match, nameLength, birthDate, isGender });

        let character: Character | null = minigame.character;

        if (match.id === minigame.character.id) {
          minigame.elapsed = Date.now() - minigame.startedAt;

          const canClaim = await canClaimRewards(ctx, account);

          if (canClaim > 0) {
            minigame.state = "PENDING";
          } else {
            await ctx.db.account.update({
              where: { id: account.id },
              data: { currency: { increment: 1 } },
            });

            await upsertMinigameStats(
              ctx,
              "GUESS_THE_IDOL",
              account,
              { type: "PETAL", amount: 1 },
              1,
              minigame.attempts.length,
              minigame.elapsed
            );

            minigame.state = "COMPLETED";
          }
        } else {
          character = null;
        }

        await setMinigame(minigame);

        return { ...minigame, character };
      },
    });
  },
});
