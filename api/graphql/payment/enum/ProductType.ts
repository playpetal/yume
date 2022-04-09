import { enumType } from "nexus";

export const ProductType = enumType({
  name: "ProductType",
  members: ["PAID_CURRENCY", "ALPHA_TITLE", "BETA_TITLE", "SIGMA_TITLE"],
});
