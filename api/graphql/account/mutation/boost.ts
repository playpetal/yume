import { extendType, nonNull } from "nexus";
import { createAnnouncement } from "../../../lib/announcement/createAnnouncement";
import { hasLilySharedSecret } from "../../../lib/Auth";
import { AuthorizationError } from "../../../lib/error";

export const boost = extendType({
  type: "Mutation",
  definition(t) {
    t.field("boost", {
      type: nonNull("Boolean"),
      args: { discordId: nonNull("String"), count: nonNull("Int") },
      async resolve(_, { discordId, count }, ctx) {
        if (!hasLilySharedSecret(ctx))
          throw new AuthorizationError("you are not authorized to do that.");

        const account = await ctx.db.account.findFirst({
          where: { discordId },
          include: { activeTitle: { include: { title: true } } },
        });

        let user = `<@${discordId}>`;
        let announcement =
          "<:booster:964619241598902282> %u just boosted the server%c! thank you so much!\n%s";
        let suffix =
          "to get your rewards, please create an account with **/register** and contact staff!";

        if (!account) {
          // modify nothing if there's no account.
          // this is necessary to prevent the later conditions from satisfying in the event that account is null
        } else if (!process.env.BOOSTER_TITLE_ID) {
          suffix = "they received the **booster** role!";
        } else {
          const title = await ctx.db.title.findFirst({
            where: { id: parseInt(process.env.BOOSTER_TITLE_ID, 10) },
          });

          if (!title) {
            suffix = "they received the **booster** role!";
          } else {
            const hasTitle = await ctx.db.titleInventory.findFirst({
              where: { accountId: account.id, titleId: title.id },
            });

            if (!hasTitle) {
              await ctx.db.titleInventory.create({
                data: {
                  accountId: account.id,
                  titleId: title.id,
                },
              });
            }

            suffix = `they received the **booster** role and the "${title.title.replace(
              "%u",
              "**<username>**"
            )}" title!`;
          }

          if (account.activeTitle) {
            user = account.activeTitle.title.title.replace(
              "%u",
              `**${account.username}**`
            );
          } else if (account) {
            user = `**${account.username}**`;
          }
        }

        await createAnnouncement(ctx, announcement, {
          "%u": user,
          "%c": count === 1 ? "" : ` **${count} times**`,
          "%s": suffix,
        });

        return true;
      },
    });
  },
});
