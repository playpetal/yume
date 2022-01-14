import { enumType } from "nexus";

export const GroupGender = enumType({
  name: "GroupGender",
  description: "Group gender",
  members: ["MALE", "FEMALE", "COED"],
});
