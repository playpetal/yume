import { objectType } from "nexus";
import { Announcement } from "nexus-prisma";

export const announcement = objectType({
  name: Announcement.$name,
  description: Announcement.$description,
  definition(t) {
    t.field(Announcement.id);
    t.field(Announcement.announcement);
    t.field(Announcement.createdAt);
  },
});
