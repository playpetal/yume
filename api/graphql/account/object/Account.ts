import { objectType, nonNull, list } from "nexus";
import { Account } from "nexus-prisma";
import { getAccountStats } from "../../../lib/account";

export const AccountObject = objectType({
  name: Account.$name,
  description: Account.$description,
  definition(t) {
    t.field(Account.id);
    t.field(Account.discordId);
    t.field(Account.username);
    t.field(Account.createdAt);
    t.field(Account.flags);
    t.field(Account.activeTitleId);
    t.field(Account.bio);
    t.field(Account.currency);
    t.field(Account.premiumCurrency);
    t.field("gts", {
      type: "GTS",
      async resolve(root, _, ctx) {
        return ctx.db.gTS.findFirst({ where: { accountId: root.id } });
      },
    });
    t.field("words", {
      type: "Words",
      async resolve(root, _, ctx) {
        return ctx.db.words.findFirst({ where: { accountId: root.id } });
      },
    });
    t.field("stats", {
      type: "AccountStats",
      async resolve(root, _, ctx) {
        return getAccountStats(ctx, root.id);
      },
    });
    t.field("title", {
      type: "Title",
      async resolve(root, _, ctx) {
        if (!root.activeTitleId) return null;

        const inventory = await ctx.db.titleInventory.findFirst({
          where: { id: root.activeTitleId },
          select: { title: true },
        });

        return inventory?.title || null;
      },
    });
    t.field("supporterTime", {
      type: "Float",
      async resolve(root, _, { db }) {
        const flags = Number(root.flags.toString(2));
        if (!(flags & 1)) return null;

        const payments = await db.payment.findMany({
          where: { accountId: root.id, success: true },
        });

        const hours = Number(
          (payments.reduce((a, b) => (a += b.cost), 0) / (83 / 730)).toFixed(2)
        );

        return hours;
      },
    });
    t.field("tags", {
      type: nonNull(list(nonNull("Tag"))),
      async resolve(root, _, { db }) {
        const tags = await db.tag.findMany({ where: { accountId: root.id } });
        return tags;
      },
    });
  },
});
