import { inputObjectType } from "nexus";

export const AccountInput = inputObjectType({
  name: "AccountInput",
  definition(t) {
    t.int("id");
    t.string("discordId");
    t.string("username");
  },
});
