import { objectType } from "nexus";

export const DiscordUserObject = objectType({
  name: "DiscordUser",
  description: "A discord user",
  definition(t) {
    t.nonNull.string("username");
    t.string("locale");
    t.boolean("mfa_enabled");
    t.int("flags");
    t.string("avatar");
    t.nonNull.string("discriminator");
    t.nonNull.string("id");
  },
});
