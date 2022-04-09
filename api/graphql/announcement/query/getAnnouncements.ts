import { extendType, list, nonNull } from "nexus";

export const getAnnouncements = extendType({
  type: "Query",
  definition(t) {
    t.field("getAnnouncements", {
      type: nonNull(list(nonNull("Announcement"))),
      async resolve(_, __, ctx) {
        const announcements = await ctx.db.announcement.findMany();

        await ctx.db.announcement.deleteMany({
          where: { id: { in: announcements.map((a) => a.id) } },
        });

        return announcements;
      },
    });
  },
});
