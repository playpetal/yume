import { Character, MinigameType, Prisma } from "@prisma/client";
import { extendType, list, nonNull } from "nexus";
import { Minigame } from "yume";
import { auth } from "../../../../lib/Auth";
import { hasFlag } from "../../../../lib/flags";
import { getBiasList } from "../../../../lib/game/bias/getBiasesList";
import { getMinigame } from "../../../../lib/minigame/redis/getMinigame";
import { isGuessTheIdol } from "../../../../lib/minigame/util/typeguards/isGuessTheIdol";

export const getGuessTheIdolAnswers = extendType({
  type: "Query",
  definition(t) {
    t.field("getGuessTheIdolAnswers", {
      type: nonNull(list(nonNull("Character"))),
      args: { search: nonNull("String") },
      async resolve(_, { search }, ctx) {
        const account = await auth(ctx);

        let minigame: Minigame<MinigameType> | null = await getMinigame(
          account.id
        );
        if (!minigame || !isGuessTheIdol(minigame)) return [];

        let character: Prisma.CharacterWhereInput = {
          name: { contains: search, mode: "insensitive" },
        };

        if (minigame.gender) character["gender"] = minigame.gender;

        let group: Prisma.GroupWhereInput | undefined;

        if (minigame.group) {
          group = { name: { contains: minigame.group, mode: "insensitive" } };
        } else if (hasFlag("MINIGAMES_USE_BIAS_LIST", account.flags)) {
          const biases = await getBiasList(ctx, account);
          const ids = biases.map((b) => b.groupId);

          group = { id: { in: ids } };
        }

        let birthday: Date | undefined;
        let birthdayBefore: Date | undefined, birthdayAfter: Date | undefined;

        let nameLength: number | undefined;
        let nameLengthMin: number | undefined,
          nameLengthMax: number | undefined;

        for (let attempt of minigame.attempts) {
          if (attempt.birthday! === minigame.character.birthday!) {
            birthday = minigame.character.birthday;
          }

          if (attempt.birthday! > minigame.character.birthday!) {
            if (!birthdayBefore || birthdayBefore > attempt.birthday!)
              birthdayBefore = attempt.birthday!;
          }

          if (attempt.birthday! < minigame.character.birthday!) {
            if (!birthdayAfter || birthdayAfter < attempt.birthday!)
              birthdayAfter = attempt.birthday!;
          }

          // name length
          if (attempt.name.length === minigame.character.name.length) {
            nameLength = minigame.character.name.length;
          }

          if (attempt.name.length > minigame.character.name.length) {
            if (!nameLengthMax || nameLengthMax > attempt.name.length)
              nameLengthMax = attempt.name.length;
          }

          if (attempt.name.length < minigame.character.name.length) {
            if (!nameLengthMin || nameLengthMin < attempt.name.length)
              nameLengthMin = attempt.name.length;
          }
        }

        character["birthday"] = birthday
          ? birthday
          : { lt: birthdayBefore, gt: birthdayAfter };

        let characters: Character[];
        characters = await ctx.db.character.findMany({
          where: {
            ...character,
            prefabs: { some: { group } },
          },
        });

        if (nameLength) {
          characters = characters.filter((c) => c.name.length === nameLength);
        } else if (nameLengthMin || nameLengthMax) {
          characters = characters.filter(
            (c) =>
              (nameLengthMin && c.name.length > nameLengthMin) ||
              (nameLengthMax && c.name.length < nameLengthMax)
          );
        }

        return characters.slice(0, 25);
      },
    });
  },
});
