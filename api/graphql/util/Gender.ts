import { enumType } from "nexus";

export const Gender = enumType({
  name: "Gender",
  description: "Character gender",
  members: ["MALE", "FEMALE", "NONBINARY"],
});
