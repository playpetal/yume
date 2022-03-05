import { extendType, list, nonNull, objectType } from "nexus";

export const GTSTimeLeaderboard = objectType({
  name: "GTSTimeLeaderboard",
  definition(t) {
    t.field("accountId", { type: nonNull("Int") });
    t.field("account", {
      type: nonNull("Account"),
      async resolve(root, _, { db }) {
        return (await db.account.findFirst({ where: { id: root.accountId } }))!;
      },
    });
    t.field("time", { type: nonNull("Int") });
  },
});

export const GetGTSTimeLeaderboard = extendType({
  type: "Query",
  definition(t) {
    t.field("getGTSTimeLeaderboard", {
      type: nonNull(list(nonNull("GTSTimeLeaderboard"))),
      async resolve(_, __, { db }) {
        const users = await db.gTS.findMany({
          where: { totalGames: { gte: 50 } },
        });

        return users
          .map((u) => {
            return {
              accountId: u.accountId,
              time: Math.ceil(u.totalTime / u.totalGames),
            };
          })
          .sort((a, b) => a.time - b.time)
          .slice(0, 10);
      },
    });
  },
});

export const GTSRewardLeaderboard = objectType({
  name: "GTSRewardLeaderboard",
  definition(t) {
    t.field("accountId", { type: nonNull("Int") });
    t.field("account", {
      type: nonNull("Account"),
      async resolve(root, _, { db }) {
        return (await db.account.findFirst({ where: { id: root.accountId } }))!;
      },
    });
    t.field("value", { type: nonNull("Int") });
  },
});

export const GetGTSRewardLeaderboard = extendType({
  type: "Query",
  definition(t) {
    t.field("getGTSRewardLeaderboard", {
      type: nonNull(list(nonNull("GTSRewardLeaderboard"))),
      args: { type: nonNull("Reward") },
      async resolve(_, { type }, { db }) {
        const users = await db.gTS.findMany({
          where: { totalGames: { gte: 50 } },
        });

        const mapped = users.map((u) => {
          return {
            accountId: u.accountId,
            value:
              type === "CARD"
                ? u.totalCards
                : type === "LILY"
                ? u.totalPremiumCurrency
                : u.totalCurrency,
          };
        });

        return mapped.sort((a, b) => b.value - a.value).slice(0, 10);
      },
    });
  },
});

export const WordsTimeLeaderboard = objectType({
  name: "WordsTimeLeaderboard",
  definition(t) {
    t.field("accountId", { type: nonNull("Int") });
    t.field("account", {
      type: nonNull("Account"),
      async resolve(root, _, { db }) {
        return (await db.account.findFirst({ where: { id: root.accountId } }))!;
      },
    });
    t.field("time", { type: nonNull("Int") });
  },
});

export const GetWordsTimeLeaderboard = extendType({
  type: "Query",
  definition(t) {
    t.field("getWordsTimeLeaderboard", {
      type: nonNull(list(nonNull("WordsTimeLeaderboard"))),
      async resolve(_, __, { db }) {
        const users = await db.words.findMany({
          where: { totalGames: { gte: 50 } },
        });

        return users
          .map((u) => {
            return {
              accountId: u.accountId,
              time: Math.ceil(u.totalTime / u.totalGames),
            };
          })
          .sort((a, b) => a.time - b.time)
          .slice(0, 10);
      },
    });
  },
});

export const WordsRewardLeaderboard = objectType({
  name: "WordsRewardLeaderboard",
  definition(t) {
    t.field("accountId", { type: nonNull("Int") });
    t.field("account", {
      type: nonNull("Account"),
      async resolve(root, _, { db }) {
        return (await db.account.findFirst({ where: { id: root.accountId } }))!;
      },
    });
    t.field("value", { type: nonNull("Int") });
  },
});

export const GetWordsRewardLeaderboard = extendType({
  type: "Query",
  definition(t) {
    t.field("getWordsRewardLeaderboard", {
      type: nonNull(list(nonNull("WordsRewardLeaderboard"))),
      args: { type: nonNull("Reward") },
      async resolve(_, { type }, { db }) {
        const users = await db.words.findMany({
          where: { totalGames: { gte: 50 } },
        });

        const mapped = users.map((u) => {
          return {
            accountId: u.accountId,
            value:
              type === "CARD"
                ? u.totalCards
                : type === "LILY"
                ? u.totalPremiumCurrency
                : u.totalCurrency,
          };
        });

        return mapped.sort((a, b) => b.value - a.value).slice(0, 10);
      },
    });
  },
});
