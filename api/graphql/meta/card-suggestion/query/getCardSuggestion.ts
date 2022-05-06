import { extendType } from "nexus";
import { UserFacingError } from "../../../../lib/error";

export const getCardSuggestion = extendType({
  type: "Query",
  definition(t) {
    t.field("getCardSuggestion", {
      type: "CardSuggestion",
      args: {
        id: "Int",
        groupName: "String",
        subgroupName: "String",
      },
      async resolve(_, { id, groupName, subgroupName }, ctx) {
        if (!id && !groupName && !subgroupName)
          throw new UserFacingError(
            "your input doesn't contain any data to search for!"
          );

        if ((groupName && !subgroupName) || (!groupName && subgroupName))
          throw new UserFacingError(
            "you must specify a group name **and** a subgroup name."
          );

        const suggestion = await ctx.db.cardSuggestion.findFirst({
          where: {
            id: id ?? undefined,
            groupName: groupName ?? undefined,
            subgroupName: subgroupName ?? undefined,
          },
          include: { votes: true },
        });

        return suggestion;
      },
    });
  },
});
