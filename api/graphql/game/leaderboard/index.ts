import { extendType, list, nonNull, objectType } from "nexus";
import { hasFlag } from "../../../lib/flags";

export const Leaderboard = objectType({
  name: "Leaderboard",
  definition(t) {
    t.field("accountId", { type: nonNull("Int") });
    t.field("account", {
      type: nonNull("Account"),
      async resolve(root, _, { db }) {
        return (await db.account.findFirst({ where: { id: root.accountId } }))!;
      },
    });
    t.field("value", { type: nonNull("Float") });
  },
});

export const GetGTSTimeLeaderboard = extendType({
  type: "Query",
  definition(t) {
    t.field("getGTSTimeLeaderboard", {
      type: nonNull(list(nonNull("Leaderboard"))),
      async resolve(_, __, { db }) {
        const users = await db.gTS.findMany({
          where: { totalGames: { gte: 25 } },
        });

        return users
          .map((u) => {
            return {
              accountId: u.accountId,
              value: Math.ceil(u.totalTime / u.totalGames),
            };
          })
          .sort((a, b) => a.value - b.value)
          .slice(0, 10);
      },
    });
  },
});

export const GetGTSRewardLeaderboard = extendType({
  type: "Query",
  definition(t) {
    t.field("getGTSRewardLeaderboard", {
      type: nonNull(list(nonNull("Leaderboard"))),
      args: { type: nonNull("Reward") },
      async resolve(_, { type }, { db }) {
        const users = await db.gTS.findMany({
          where: { totalGames: { gte: 25 } },
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

export const GetWordsTimeLeaderboard = extendType({
  type: "Query",
  definition(t) {
    t.field("getWordsTimeLeaderboard", {
      type: nonNull(list(nonNull("Leaderboard"))),
      async resolve(_, __, { db }) {
        const users = await db.words.findMany({
          where: { totalGames: { gte: 25 } },
        });

        return users
          .map((u) => {
            return {
              accountId: u.accountId,
              value: Math.ceil(u.totalTime / u.totalGames),
            };
          })
          .sort((a, b) => a.value - b.value)
          .slice(0, 10);
      },
    });
  },
});

export const GetWordsRewardLeaderboard = extendType({
  type: "Query",
  definition(t) {
    t.field("getWordsRewardLeaderboard", {
      type: nonNull(list(nonNull("Leaderboard"))),
      args: { type: nonNull("Reward") },
      async resolve(_, { type }, { db }) {
        const users = await db.words.findMany({
          where: { totalGames: { gte: 25 } },
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

export const GetSupporterLeaderboard = extendType({
  type: "Query",
  definition(t) {
    t.field("getSupporterLeaderboard", {
      type: nonNull(list(nonNull("Leaderboard"))),
      async resolve(_, __, { db }) {
        const payments = await db.payment.findMany({
          where: { success: true },
          include: { account: { select: { flags: true } } },
        });

        let supporters: { accountId: number; value: number }[] = [];

        for (let payment of payments) {
          if (!hasFlag("PUBLIC_SUPPORTER", payment.account.flags)) continue;

          const exists = supporters.find(
            (d) => d.accountId === payment.accountId
          );
          if (exists) {
            exists.value += payment.cost;
          } else
            supporters.push({
              accountId: payment.accountId,
              value: payment.cost,
            });
        }

        return supporters
          .map((d) => {
            return {
              accountId: d.accountId,
              value: Number((d.value / (83 / 730)).toFixed(2)),
            };
          })
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);
      },
    });
  },
});
