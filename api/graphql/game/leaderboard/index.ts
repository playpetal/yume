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
