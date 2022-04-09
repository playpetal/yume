import { Announcement } from "@prisma/client";
import { Context } from "../../context";

export async function createAnnouncement(
  ctx: Context,
  text: string,
  variables?: { [key: string]: string | number }
): Promise<Announcement> {
  if (variables) {
    for (let [key, value] of Object.entries(variables)) {
      text = text.replace(key, `${value}`);
    }
  }

  const announcement = await ctx.db.announcement.create({
    data: { announcement: text },
  });
  return announcement;
}
