import { MinigameType } from "@prisma/client";
import { extendType, list, nonNull } from "nexus";
import { hasFlag } from "../../../../lib/flags";

export const getLeaderboard = extendType({
  type: "Query",
  definition(t) {
    t.field("getLeaderboard", {
      type: nonNull(list(nonNull("Leaderboard"))),
      args: { type: nonNull("LeaderboardType") },
      async resolve(_, { type }, { db }) {
        let leaderboard: { accountId: number; value: number }[] = [];

        if (type === "PUBLIC_SUPPORTER") {
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

          leaderboard = supporters.map(({ accountId, value }) => {
            return {
              accountId: accountId,
              value: Number((value / (83 / 730)).toFixed(2)),
            };
          });

          return leaderboard.sort((a, b) => b.value - a.value).slice(0, 10);
        }

        const minigameType: MinigameType = type.split("x")[0] as MinigameType;

        const users = await db.minigameStats.findMany({
          where: { type: minigameType, totalGames: { gte: 25 } },
        });

        const minigameSubtype: "PETAL" | "CARD" | "LILY" | "TIME" = type.split(
          "x"
        )[1] as "PETAL" | "CARD" | "LILY" | "TIME";

        if (minigameSubtype === "PETAL") {
          leaderboard = users
            .map(({ accountId, totalCurrency }) => {
              return { accountId: accountId, value: totalCurrency };
            })
            .sort((a, b) => b.value - a.value);
        } else if (minigameSubtype === "CARD") {
          leaderboard = users
            .map(({ accountId, totalCards }) => {
              return { accountId: accountId, value: totalCards };
            })
            .sort((a, b) => b.value - a.value);
        } else if (minigameSubtype === "LILY") {
          leaderboard = users
            .map(({ accountId, totalPremiumCurrency }) => {
              return { accountId: accountId, value: totalPremiumCurrency };
            })
            .sort((a, b) => b.value - a.value);
        } else if (minigameSubtype === "TIME") {
          leaderboard = users
            .map(({ accountId, totalTime, totalGames }) => {
              return {
                accountId: accountId,
                value: Math.ceil(totalTime / totalGames),
              };
            })
            .sort((a, b) => a.value - b.value);
        }

        return leaderboard.sort((a, b) => b.value - a.value).slice(0, 10);
      },
    });
  },
});
