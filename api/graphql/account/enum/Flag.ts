import { enumType } from "nexus";

export const Flag = enumType({
  name: "Flag",
  description: "Account Flags",
  members: [
    { name: "DEVELOPER" },
    { name: "RELEASE_MANAGER" },
    { name: "PUBLIC_SUPPORTER" },
  ],
});
