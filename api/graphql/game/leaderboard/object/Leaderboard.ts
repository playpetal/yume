import { objectType, nonNull } from "nexus";

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
