import { enumType } from "nexus";

export const Order = enumType({
  name: "InventoryOrder",
  description: "Inventory ordering type",
  members: ["ASC", "DESC"],
});
