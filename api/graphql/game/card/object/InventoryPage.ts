import { objectType, nonNull } from "nexus";

export const InventoryPageObject = objectType({
  name: "InventoryPage",
  definition(t) {
    t.field("max", { type: nonNull("Int") });
    t.field("cards", { type: nonNull("Int") });
  },
});
