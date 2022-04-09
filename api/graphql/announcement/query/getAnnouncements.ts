import { extendType, list, nonNull } from "nexus";
import { AuthorizationError } from "../../../lib/error";

export const getAnnouncements = extendType({
  type: "Query",
  definition(t) {
    t.field("getAnnouncements", {
      type: nonNull(list(nonNull("Announcement"))),
      async resolve(_, __, ctx) {
        const auth = ctx.req.headers.authorization;

        if (auth !== process.env.SHARED_SECRET)
          throw new AuthorizationError(
            "you are not allowed to access this query."
          );

        const announcements = await ctx.db.announcement.findMany();

        await ctx.db.announcement.deleteMany({
          where: { id: { in: announcements.map((a) => a.id) } },
        });

        return announcements;
      },
    });
  },
});
