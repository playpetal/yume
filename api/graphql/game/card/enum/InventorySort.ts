import { enumType } from "nexus";

export const Sort = enumType({
  name: "InventorySort",
  description: "Inventory sorting type",
  members: ["ISSUE", "CODE", "GROUP", "SUBGROUP", "CHARACTER", "STAGE"],
});
